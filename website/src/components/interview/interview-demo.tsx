"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, FileSearch, LayoutDashboard, ShieldCheck, UserRound, Users, Wand2, UserCog } from "lucide-react";
import { useInterviewStore } from "@/store/interview-store";
import { useStrategyMode } from "@/hooks/use-strategy-mode";
import { Tabs, Segmented } from "@/components/ui/tabs";
import { Callout } from "@/components/ui/misc";
import { Mascot } from "@/components/shared/brand";
import { SourceLabel } from "@/components/shared/source-label";
import { HrOverview } from "./hr-overview";
import { JobManagement } from "./job-management";
import { InterviewBuilder } from "./interview-builder";
import { CandidatesPanel } from "./candidates-panel";
import { ReportViewer } from "./report-viewer";
import { ResponsibleAi } from "./responsible-ai";
import { CandidateExperience } from "./candidate-experience";

type HrTab = "overview" | "jobs" | "builder" | "candidates" | "report" | "responsible";

export function InterviewDemo() {
  const role = useInterviewStore((s) => s.role);
  const setRole = useInterviewStore((s) => s.setRole);
  const jobs = useInterviewStore((s) => s.jobs);
  const { mode } = useStrategyMode();
  const [tab, setTab] = useState<HrTab>("overview");
  const [builderJob, setBuilderJob] = useState(jobs[0]?.id ?? "");
  const [reportId, setReportId] = useState<string | undefined>();

  const openReport = (id: string) => {
    setReportId(id);
    setTab("report");
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-one-gradient p-6 text-white shadow-card sm:p-8">
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
        <Mascot name="interview" size={150} className="absolute -bottom-6 right-4 hidden md:block" />
        <div className="relative max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ring-1 ring-white/25">HRTech · Interactive prototype</span>
            <SourceLabel type="synthetic-demo" dark />
          </div>
          <h2 className="mt-3 text-3xl font-extrabold">AI Candidate Interview</h2>
          <p className="mt-1 text-white/85">From Generic Interview Scores to Evidence-Based Recruiter Insights. Pilih peran untuk memulai.</p>
          <Segmented
            dark
            className="mt-5"
            value={role}
            onChange={setRole}
            items={[
              { id: "recruiter", label: "Recruiter / HR", icon: <UserCog className="h-3.5 w-3.5" /> },
              { id: "candidate", label: "Kandidat", icon: <UserRound className="h-3.5 w-3.5" /> },
            ]}
          />
        </div>
      </div>

      {mode === "one" && (
        <Callout tone="info" title="Mode ONE aktif — produk prioritas">
          Seluruh kapasitas pengembangan diarahkan ke AI Interview Intelligence Suite: builder, assessment berbasis bukti, dashboard recruiter,
          dan kontrol Responsible AI.
        </Callout>
      )}
      {mode === "ace" && (
        <Callout tone="info" title="Mode ACE aktif — dikembangkan dalam portofolio">
          Workflow HR esensial dibangun selektif dengan batas WIP 1 inisiatif besar, berdampingan dengan Terang Events.
        </Callout>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {role === "recruiter" ? (
            <div className="space-y-6">
              <Tabs<HrTab>
                value={tab}
                onChange={setTab}
                items={[
                  { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
                  { id: "jobs", label: "Posisi", icon: <Briefcase className="h-4 w-4" /> },
                  { id: "builder", label: "Interview Builder", icon: <Wand2 className="h-4 w-4" /> },
                  { id: "candidates", label: "Kandidat", icon: <Users className="h-4 w-4" /> },
                  { id: "report", label: "Laporan", icon: <FileSearch className="h-4 w-4" /> },
                  { id: "responsible", label: "Responsible AI", icon: <ShieldCheck className="h-4 w-4" /> },
                ]}
              />
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {tab === "overview" && <HrOverview onOpenReport={openReport} onCandidates={() => setTab("candidates")} />}
                  {tab === "jobs" && (
                    <JobManagement
                      onBuild={(id) => {
                        setBuilderJob(id);
                        setTab("builder");
                      }}
                    />
                  )}
                  {tab === "builder" && <InterviewBuilder jobId={builderJob} onJobChange={setBuilderJob} />}
                  {tab === "candidates" && <CandidatesPanel onOpenReport={openReport} />}
                  {tab === "report" && <ReportViewer candidateId={reportId} onSelect={setReportId} />}
                  {tab === "responsible" && <ResponsibleAi />}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <CandidateExperience
              onViewAsRecruiter={(id) => {
                setRole("recruiter");
                openReport(id);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
