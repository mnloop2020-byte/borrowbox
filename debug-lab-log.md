# Debug lab log

The 5 bugs from the ShopBoard debug lab (https://shopboard-api.vercel.app/debug-lab/).

## Bug 1

- **What I saw:** As soon as the page loaded, the Console showed a red React warning: "Each child in a list should have a unique "key" prop. Check the render method of `CategoryChips`." The page looked fine.
- **Component:** `CategoryChips`
- **How I found it:** Console warning. The warning named the component. The source map did not load, so I searched for `CategoryChips.tsx` with Ctrl + P and found nothing. I opened the built file `index-CbYUo1e8.js` in Sources and searched for `function CategoryChips` with Ctrl + F.
- **Cause:** `CategoryChips.tsx`, line 9: `categories.map((category) => <span className="chip">{category}</span>)`. The element returned by `.map()` has no `key` (in the built code the third argument of `jsxDEV` is `void 0`, so the key is `undefined`). React uses the key to know which element is which when the list changes, so without it React can mix up the elements.
- **Fix:** Give each chip a key that is unique and does not change. The category name is unique, so:

  ```tsx
  {
    categories.map((category) => (
      <span key={category} className="chip">
        {category}
      </span>
    ));
  }


  Not the index (`key={i}`): if the list changes order, the index stays with the position, not with the category.
  ```

## Bug 2

- **What I saw:** A "0" on its own under the name of every sold-out product, and a "0" in the cart while it was empty. Nobody wrote that 0.
- **Component:** `StockNote` (the sold-out cards) and `CartPanel` (the empty cart)
- **How I found it:** By looking at the page (step 2 of the lab). Then Sources: in `index-CbYUo1e8.js` I searched for `function StockNote` and `function CartPanel` with Ctrl + F.
- **Cause:** `StockNote.tsx`, line 6: `{stock && <span>Only {stock} left</span>}`, and `CartPanel.tsx`, line 19: `{cart.length && <ul>…</ul>}`. `a && b` returns `a` when `a` is false-like, and `0` is false-like, so when the stock or the cart length is `0` the result is the number `0`. React skips `false`, `null` and `undefined`, but it draws numbers, so it shows "0".
- **Fix:** Make the condition a real `true` or `false`, not a number:

  ```tsx
  {
    stock > 0 && <span>Only {stock} left</span>;
  }
  {
    cart.length > 0 && <ul>…</ul>;
  }
  ```

## Bug 3

- **What I saw:** I saved the Leather Tote Bag (♡ became ♥), then sorted by "Price: low to high". The heart was now on another product, not on the Leather Tote Bag.
- **Component:** `ProductList` (the heart lives in `ProductCard`)
- **How I found it:** By trying the steps on the page. Then Sources: `ProductCard` keeps the heart in its own state (`const [saved, setSaved] = useState(false)`), and in `function ProductList` the cards are drawn with `index` as the key.
- **Cause:** `ProductList.tsx`, line 18: `shown.map((product, index) => <ProductCard key={index} … />)`. React keeps each component's state with its key. After sorting, the card with `key="0"` is still there, so React keeps its `saved = true`, but that card now shows a different product. The heart is tied to the position in the list, not to the product.
- **Fix:** Use a key that belongs to the product and never changes, its id:

  ```tsx
  <ProductCard key={product.id} product={product} onAdd={onAdd} />
  ```

## Bug 4

- **What I saw:** I sorted by "Price: low to high", then went back to "Featured". The products did not come back to the order they had when the page loaded; they stayed sorted by price.
- **Component:** `ProductList`
- **How I found it:** By trying the steps on the page. Then Sources: the first line of `function ProductList` sorts the `products` prop.
- **Cause:** `ProductList.tsx`, line 13: `products.sort((a, b) => a.price - b.price)`. `.sort()` changes the array itself instead of making a new one. `products` is the original list from `App`, so after one sort the original order is lost, and "Featured" shows the already sorted array.
- **Fix:** Sort a copy, so the original list never changes:

  ```tsx
  const shown =
    sort === "price-asc"
      ? [...products].sort((a, b) => a.price - b.price)
      : products;
  ```

  (`products.toSorted(...)` also returns a sorted copy.)

## Bug 5

- **What I saw:** I added the Canvas Backpack to the cart and clicked + twice. The number stayed at 1 and the total did not change. When I added another product, the backpack suddenly jumped to 3.
- **Component:** `CartRow` (and `App`, which gives it `onChange`)
- **How I found it:** By trying the steps on the page. In the Components tab, `CartRow`'s `item.qty` prop was already higher than the number on screen. With "Highlight updates" on, nothing flashed when I clicked +, so React did not draw again.
- **Cause:** Two mistakes together. `CartRow.tsx`, line 11: `item.qty = item.qty + 1` changes the prop object itself (props are read-only). `App.tsx`, line 35: `onChange={() => setCart(cart)}` gives React the same array. React compares the new state with the old one, sees the same reference, and skips drawing. The changed number only showed up later, when adding another product made a real state change.
- **Fix:** Never change state or props directly; give React a new array with a new object for the changed item. `App` owns the cart, so the change goes there:

  ```tsx
  // App.tsx
  function increase(id: number) {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  }
  <CartPanel cart={cart} products={PRODUCTS} onIncrease={increase} />

  // CartRow.tsx: only tells App which item
  <button type="button" onClick={() => onIncrease(item.id)}>+</button>
  ```

  `add()` in `App.tsx` (line 17) already does it the right way.
