import { formatMoney, t, tValue } from "../i18n/i18n.ts";
import { todayISO } from "../logic/dates.ts";
import { escapeHtml, isSafeImageUrl } from "../logic/html.ts";
import {
  createRequestRecord,
  deriveItemStatus,
  validateRequest,
} from "../logic/requests.ts";
import { addRequest, getRequests } from "../store/requestStore.ts";
import { SEED_ITEMS } from "../store/seedData.ts";
import { userStore } from "../store/userStore.ts";
import type { Item, ItemStatus, MountedView } from "../types.ts";
import { getElement } from "../utils/dom.ts";

/** Translated text, escaped for use inside these HTML templates */
const tx = (key: string, values?: Record<string, unknown>): string =>
  escapeHtml(t(key, values));

/** Booking messages, from the dictionaries by code */
const message = (code: string): string => t(`booking.error.${code}`);

function renderNotFound(): string {
  return `
    <section class="placeholder-view" aria-labelledby="page-title">
      <h1 id="page-title">${tx("item.notFoundTitle")}</h1>
      <p>${tx("item.notFoundText")}</p>
      <p class="placeholder-actions"><a href="#/catalog" class="btn btn-accent">${tx("item.browseCatalog")}</a></p>
    </section>
  `;
}

function renderOwnerCard(item: Item): string {
  const rating = Number(item.ownerRating);
  return `
    <section class="item-owner" aria-labelledby="owner-heading">
      <h2 id="owner-heading" class="item-subheading">${tx("item.ownerHeading")}</h2>
      <p class="item-owner-name">
        ${escapeHtml(item.ownerName)}
        ${item.ownerVerified ? `<span class="verified-badge">${tx("item.verified")}</span>` : ""}
      </p>
      ${Number.isFinite(rating) && rating > 0 ? `<p class="item-owner-rating">${tx("item.rating", { rating })}</p>` : ""}
    </section>
  `;
}

function renderBookingForm(today: string): string {
  return `
    <form id="borrow-form" class="borrow-form" novalidate>
      <div class="date-fields">
        <div class="form-field">
          <label for="borrow-start">${tx("booking.from")}</label>
          <input type="date" id="borrow-start" name="start" min="${today}" required aria-describedby="borrow-start-error" />
          <p id="borrow-start-error" class="field-error" hidden></p>
        </div>
        <div class="form-field">
          <label for="borrow-end">${tx("booking.to")}</label>
          <input type="date" id="borrow-end" name="end" min="${today}" required aria-describedby="borrow-end-error" />
          <p id="borrow-end-error" class="field-error" hidden></p>
        </div>
      </div>
      <button type="submit" class="btn btn-accent btn-lg borrow-submit">${tx("booking.submit")}</button>
      <div id="borrow-status" class="form-message" role="status"></div>
      <div id="borrow-alert" class="form-message form-message--error" role="alert"></div>
    </form>
  `;
}

function renderItem(
  item: Item,
  status: ItemStatus,
  isOwner: boolean,
  today: string,
): string {
  const deposit = Number(item.depositAmount);
  return `
    <article class="item-detail" aria-labelledby="item-title">
      <a href="#/catalog" class="text-link item-back"><span class="icon-directional" aria-hidden="true">←</span> ${tx("item.back")}</a>

      <div class="item-detail-layout">
        <div class="item-detail-main">
          ${
            isSafeImageUrl(item.imageUrl)
              ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" class="item-detail-img" />`
              : ""
          }
          <p class="item-detail-category">${escapeHtml(tValue("category", item.category))}</p>
          <h1 id="item-title" class="item-detail-title">${escapeHtml(item.title)}</h1>
          <p class="item-card-badge status-${status.toLowerCase()} item-detail-status">${escapeHtml(tValue("status", status))}</p>
          <p class="item-detail-description">${escapeHtml(item.description)}</p>

          <section class="item-condition" aria-labelledby="condition-heading">
            <h2 id="condition-heading" class="item-subheading">${tx("item.conditionHeading", { condition: tValue("condition", item.condition) })}</h2>
            <p>${escapeHtml(item.conditionNotes)}</p>
          </section>

          ${renderOwnerCard(item)}
        </div>

        <aside class="booking-panel" aria-labelledby="booking-heading">
          <h2 id="booking-heading" class="item-subheading">${tx("booking.depositHeading")}</h2>
          <p class="booking-deposit">${escapeHtml(formatMoney(deposit))}</p>
          <p class="booking-note">${tx("booking.note")}</p>
          ${
            isOwner
              ? `<p class="booking-owner-note">${tx("booking.ownerNote")}</p>`
              : renderBookingForm(today)
          }
        </aside>
      </div>
    </article>
  `;
}

/** Shows or clears one field's error, keeping the ARIA state in step */
function setFieldError(
  form: HTMLFormElement,
  field: "start" | "end",
  message: string,
): void {
  const input = getElement<HTMLInputElement>(form, `#borrow-${field}`);
  const error = getElement(form, `#borrow-${field}-error`);
  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
  error.textContent = message;
  error.hidden = !message;
}

function bindBookingForm(container: HTMLElement, item: Item): void {
  const form = container.querySelector<HTMLFormElement>("#borrow-form");
  if (!form) return;
  const statusBox = getElement(form, "#borrow-status");
  const alertBox = getElement(form, "#borrow-alert");
  const startInput = getElement<HTMLInputElement>(form, "#borrow-start");
  const endInput = getElement<HTMLInputElement>(form, "#borrow-end");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const startDate = startInput.value;
    const endDate = endInput.value;
    const borrower = userStore.getCurrentUser();

    setFieldError(form, "start", "");
    setFieldError(form, "end", "");
    statusBox.textContent = "";
    alertBox.textContent = "";

    const result = validateRequest({
      item,
      borrowerId: borrower.id,
      startDate,
      endDate,
      requests: getRequests(),
      today: todayISO(),
    });

    if (!result.ok) {
      const text = message(result.code);
      if (result.field === "form") {
        alertBox.textContent = text;
      } else {
        setFieldError(form, result.field, text);
        (result.field === "start" ? startInput : endInput).focus();
      }
      return;
    }

    const saved = addRequest(
      createRequestRecord({
        item,
        borrower,
        startDate,
        endDate,
        now: new Date(),
        id: `req-${Date.now()}`,
      }),
    );
    if (!saved) {
      alertBox.textContent = message("save-failed");
      return;
    }
    form.reset();
    statusBox.textContent = t("booking.success");
  });
}

/**
 * Mounts the item page for one item.
 *
 * @param itemId - already checked by isValidItemId
 */
export function mountItemDetailView(
  container: HTMLElement,
  itemId: string,
): MountedView {
  const item = SEED_ITEMS.find((candidate) => candidate.id === itemId);
  if (!item) {
    container.innerHTML = renderNotFound();
    return { title: t("title.itemNotFound"), cleanup: () => {} };
  }

  const today = todayISO();
  const status = deriveItemStatus(item, getRequests(), today);
  const isOwner = userStore.getCurrentUser().id === item.ownerId;

  container.innerHTML = renderItem(item, status, isOwner, today);
  bindBookingForm(container, item);

  return { title: t("title.item", { title: item.title }), cleanup: () => {} };
}
