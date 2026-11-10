import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next dev` would write an AGENTS.md; the agent rules live in CLAUDE.md
  agentRules: false,
};

export default nextConfig;
