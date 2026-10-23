"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useInterviewStore } from "@/store/interview-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceLabel } from "@/components/shared/source-label";
import { HrOverview } from "@/components/interview/hr-overview";
import { JobManagement } from "@/components/interview/job-management";
import { InterviewBuilder } from "@/components/interview/interview-builder";
import { CandidatesPanel } from "@/components/interview/candidates-panel";
import { ReportViewer } from "@/components/interview/report-viewer";
import { ResponsibleAi } from "@/components/interview/responsible-ai";
import { CandidateExperience } from "@/components/interview/candidate-experience";
import { L, T } from "@/lib/i18n";
import { PageHeader } from "./page-header";
import { ModeNotice } from "./mode-notice";
import { QuickStart } from "./quick-start";

const BASE = "/dashboard/interview";
const DEMO = <SourceLabel type="synthetic-demo" compact />;

const reportHref = (id: string) => `${BASE}/reports?candidate=${encodeURIComponent(id)}`;

export function InterviewOverviewPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        eyebrow={DEMO}
        title={<T id="Halo, Recruiter Demo" en="Hello, Demo Recruiter" />}
        description={<T id="Pantau lowongan, kandidat yang menunggu tinjauan, dan jejak audit terbaru." en="Track vacancies, candidates awaiting review and the latest audit trail." />}
        actions={
          <Button href={`${BASE}/jobs`} variant="one">
            <Plus className="h-4 w-4" /> <T id="Kelola lowongan" en="Manage vacancies" />
          </Button>
        }
      />
      <ModeNotice product="interview" className="mb-6" />
      <QuickStart
        id="interview"
        title={L("Mulai dari sini — alur _recruiter_", "Start here — the recruiter flow")}
        accent="bg-one-gradient"
        steps={[
          {
            title: L("Buat lowongan", "Create a vacancy"),
            text: L("Pilih _template_ jabatan, kompetensi, dan bobotnya (total 100%).", "Choose a role template, competencies and their weights (totalling 100%)."),
            href: `${BASE}/jobs`,
            icon: "briefcase",
          },
          {
            title: L("Susun pertanyaan", "Compose questions"),
            text: L("Tinjau saran pertanyaan per kompetensi, edit, lalu publikasikan.", "Review suggested questions per competency, edit them, then publish."),
            href: `${BASE}/builder`,
            icon: "wand",
          },
          {
            title: L("Jalankan wawancara", "Run the interview"),
            text: L("Undang kandidat, atau coba sendiri wawancaranya lewat Portal Kandidat.", "Invite candidates, or try the interview yourself in the Candidate Portal."),
            href: `${BASE}/portal`,
            icon: "user",
          },
          {
            title: L("Tinjau laporan bukti", "Review evidence reports"),
            text: L("Cek kutipan jawaban per kompetensi, beri catatan, lalu tandai selesai ditinjau.", "Check answer quotes per competency, add notes, then mark as reviewed."),
            href: `${BASE}/reports`,
            icon: "filesearch",
          },
        ]}
      />
      <HrOverview onOpenReport={(id) => router.push(reportHref(id))} onCandidates={() => router.push(`${BASE}/candidates`)} />
    </>
  );
}

export function InterviewJobsPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title={<T id="Lowongan" en="Vacancies" />}
        description={<T id="Atur posisi dan kompetensi berbobot yang menjadi dasar rubrik penilaian." en="Set up roles and the weighted competencies that underpin the assessment rubric." />}
      />
      <JobManagement onBuild={(id) => router.push(`${BASE}/builder?job=${encodeURIComponent(id)}`)} />
    </>
  );
}

export function InterviewBuilderPage() {
  const router = useRouter();
  const jobs = useInterviewStore((s) => s.jobs);
  const requested = useSearchParams().get("job");
  const jobId = jobs.some((j) => j.id === requested) ? (requested as string) : (jobs[0]?.id ?? "");
  return (
    <>
      <PageHeader
        title="Interview Builder"
        description={<T id="Susun pertanyaan per kompetensi, atur _follow-up_, lalu publikasikan ke kandidat." en="Compose questions per competency, set follow-ups, then publish to candidates." />}
      />
      <InterviewBuilder jobId={jobId} onJobChange={(id) => router.replace(`${BASE}/builder?job=${encodeURIComponent(id)}`, { scroll: false })} />
    </>
  );
}

export function InterviewCandidatesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title={<T id="Kandidat" en="Candidates" />}
        description={<T id="Undang kandidat, pantau status wawancara, dan buka laporan berbasis bukti." en="Invite candidates, track interview status and open evidence-based reports." />}
      />
      <CandidatesPanel onOpenReport={(id) => router.push(reportHref(id))} />
    </>
  );
}

export function InterviewReportsPage() {
  const router = useRouter();
  const candidate = useSearchParams().get("candidate") ?? undefined;
  return (
    <>
      <PageHeader
        eyebrow={
          <Badge tone="success">
            <T id="_Human-in-the-loop_" en="Human-in-the-loop" />
          </Badge>
        }
        title={<T id="Laporan berbasis bukti" en="Evidence-based reports" />}
        description={
          <T
            id="Setiap penilaian dikaitkan dengan kutipan jawaban kandidat. Keputusan akhir tetap di tangan _recruiter_."
            en="Every rating is linked to a quote from the candidate's answers. The final decision stays with the recruiter."
          />
        }
      />
      <ReportViewer candidateId={candidate} onSelect={(id) => router.replace(reportHref(id), { scroll: false })} />
    </>
  );
}

export function InterviewResponsibleAiPage() {
  return (
    <>
      <PageHeader
        eyebrow={<SourceLabel type="strategic-proposal" compact />}
        title="Responsible AI"
        description={
          <T
            id="AI sebagai pendukung keputusan, bukan otoritas perekrutan. Atur tinjauan manusia, privasi, dan retensi data."
            en="AI as decision support, not a hiring authority. Configure human review, privacy and data retention."
          />
        }
      />
      <ResponsibleAi />
    </>
  );
}

export function InterviewPortalPage() {
  const router = useRouter();
  const setRole = useInterviewStore((s) => s.setRole);
  return (
    <>
      <PageHeader
        eyebrow={
          <Badge tone="one">
            <T id="Tampilan kandidat" en="Candidate view" />
          </Badge>
        }
        title={<T id="Portal Kandidat" en="Candidate Portal" />}
        description={<T id="Simulasikan wawancara dari sisi kandidat, lalu lihat laporannya sebagai _recruiter_." en="Simulate the interview as a candidate, then view the report as a recruiter." />}
      />
      <CandidateExperience
        onViewAsRecruiter={(id) => {
          setRole("recruiter");
          router.push(reportHref(id));
        }}
      />
    </>
  );
}
