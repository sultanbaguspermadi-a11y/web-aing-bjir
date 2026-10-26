"use client";

import { useLang } from "./language-provider";
import { Button, Divider, WordsMask } from "./primitives";
import { ProjectImage } from "./project-image";
import { AccentTint, HoverLine, ProjectIndex, Rise, Tiles } from "./project-parts";
import { PROJECTS, type ProjectMeta } from "@/content/site";
import type { ProjectCopy } from "@/content/copy";

const TOTAL = PROJECTS.length;

function MetaList({ copy, className }: { copy: ProjectCopy; className?: string }) {
  const { t } = useLang();
  const rows: [string, string][] = [
    [t.project.labels.category, copy.category],
    [t.project.labels.platform, copy.platform],
    [t.project.labels.focus, copy.focus],
  ];
  return (
    <dl className={className}>
      {rows.map(([label, value]) => (
        <div key={label} className="project-meta">
          <dt className="ff-meta text-ink-soft">{label}</dt>
          <dd className="ff-ui mt-1 text-sm">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 01: wide, calm, image-led composition. */
export function LughotiProject({ project }: { project: ProjectMeta }) {
  const { t } = useLang();
  const copy = t.projects.lughoti;
  return (
    <article
      id="project-lughoti"
      aria-label={project.title}
      className="project relative isolate overflow-clip py-24 md:py-36"
    >
      <AccentTint color={project.accent} />
      <div className="container-x">
        <div className="flex items-start justify-between gap-6">
          <ProjectIndex n={1} total={TOTAL} />
          <Rise delay={0.1}>
            <p className="ff-annot text-xl text-ink-soft">{copy.category}</p>
          </Rise>
        </div>

        <h3 className="project-title project-shift mb-10 mt-8 md:mb-14">
          <WordsMask text={project.title} mode="y" />
        </h3>

        <ProjectImage
          src={project.image.src}
          alt={copy.imageAlt}
          accent={project.accent}
          href={project.href}
          aspect="16 / 9.4"
          sizes="(min-width: 1680px) 1560px, 94vw"
          delay={0.3}
        />

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
          <Rise as="p" delay={0.1} className="ff-literary text-2xl text-pretty md:col-span-5 md:text-3xl">
            {copy.summary}
          </Rise>
          <MetaList copy={copy} className="grid grid-cols-3 gap-6 md:col-span-5 md:col-start-8" />
        </div>

        <div className="mt-12 flex items-center gap-8">
          <Button href={project.href} icon="ne" external>
            {t.project.cta}
          </Button>
        </div>
        <div className="mt-14">
          <HoverLine color={project.accent} />
        </div>
      </div>
    </article>
  );
}

/** 02: split composition, sticky text column, board tilts into place. */
export function ScrabbleProject({ project }: { project: ProjectMeta }) {
  const { t } = useLang();
  const copy = t.projects.scrabble;
  return (
    <article
      id="project-scrabble"
      aria-label={project.title}
      className="project relative isolate overflow-clip py-24 md:py-36"
    >
      <AccentTint color={project.accent} />
      <div className="container-x">
        <Divider className="mb-14" />
        <div className="grid gap-x-12 gap-y-14 md:grid-cols-12">
          <div className="md:sticky md:top-28 md:col-span-5 md:self-start">
            <div className="flex items-start justify-between gap-6">
              <ProjectIndex n={2} total={TOTAL} />
              <Rise delay={0.1}>
                <p className="ff-annot text-xl text-ink-soft">{copy.category}</p>
              </Rise>
            </div>

            <h3 className="project-title project-shift mt-8">
              {project.title.split(" ").map((word, i) => (
                <span key={word} className="block">
                  <WordsMask text={word} mode="x" delay={i * 0.14} />
                </span>
              ))}
            </h3>

            <div className="mt-10">
              <Tiles color={project.accent} />
            </div>

            <Rise as="p" delay={0.15} className="ff-literary mt-10 max-w-[30rem] text-xl text-pretty md:text-2xl">
              {copy.summary}
            </Rise>

            <MetaList copy={copy} className="mt-10 grid max-w-[30rem] grid-cols-3 gap-6" />

            <div className="mt-12">
              <Button href={project.href} icon="ne" external>
                {t.project.cta}
              </Button>
            </div>
          </div>

          <div className="md:col-span-7">
            <ProjectImage
              src={project.image.src}
              alt={copy.imageAlt}
              accent={project.accent}
              href={project.href}
              aspect="4 / 3.2"
              sizes="(min-width: 1680px) 900px, (min-width: 768px) 56vw, 94vw"
              rotateFrom={1}
              delay={0.35}
            />
          </div>
        </div>
        <div className="mt-20">
          <HoverLine color={project.accent} />
        </div>
      </div>
    </article>
  );
}
