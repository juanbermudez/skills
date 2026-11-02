# Skills

Agent skills by Juan Bermudez, one folder each under `skills/`, with a site per skill under `docs/`.

| Skill | What it does | Site |
|---|---|---|
| [animated-visuals](skills/animated-visuals/) | Figures and diagrams built the stageshow way, plus a runtime for explorable figures: scrubbable timelines, drag handles, explorable charts, 27 themes. | [juanbermudez.github.io/skills/animated-visuals](https://juanbermudez.github.io/skills/animated-visuals/) |
| [guide](skills/guide/) | One self-contained HTML guide for a topic, paper, codebase or decision, with practical writing, source checks, and figures built the stageshow way. | [juanbermudez.github.io/skills/guide](https://juanbermudez.github.io/skills/guide/) |
| [plan-work](skills/plan-work/) | Plans with a decision, evidence, staged work and stageshow visuals, published as a bb Drive doc. Works with Claude Code plan mode. | — |

Figures in `animated-visuals`, `guide` and `plan-work` follow [stageshow](https://github.com/benjitaylor/skills) (`npx skills add benjitaylor/skills --skill stageshow -g`, then `npm install` in its folder).

## Install one skill

```sh
# skills.sh, into Claude Code or Codex
npx skills@latest add juanbermudez/skills --skill animated-visuals -g -a claude-code
npx skills@latest add juanbermudez/skills --skill animated-visuals -g -a codex
npx skills@latest add juanbermudez/skills --skill guide -g -a claude-code
npx skills@latest add juanbermudez/skills --skill guide -g -a codex

# Claude Code plugin, which updates itself
claude plugin marketplace add juanbermudez/skills
claude plugin install animated-visuals@juanbermudez
claude plugin install guide@juanbermudez
```

## Develop

Clone the repository and symlink the skills into your agents' skill folders; `git pull` then updates the installs.

```sh
git clone https://github.com/juanbermudez/skills ~/Desktop/skills
~/Desktop/skills/scripts/link-skills.sh
```

Each skill is a folder with `SKILL.md`, `references/`, `assets/` and `scripts/`, following the [Agent Skills](https://agentskills.io/specification) layout. The sites are static files committed under `docs/<skill>/`; each skill's `docs/<skill>/sync.mjs` refreshes its site from the skill.

## License

MIT, see [LICENSE](LICENSE). Third-party notices live with each skill.
