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
        title="Halo, Recruiter Demo"
        description="Pantau lowongan, kandidat yang menunggu tinjauan, dan jejak audit terbaru."
        actions={
          <Button href={`${BASE}/jobs`} variant="one">
            <Plus className="h-4 w-4" /> Kelola lowongan
          </Button>
        }
      />
      <ModeNotice product="interview" className="mb-6" />
      <QuickStart
        id="interview"
        title="Mulai dari sini — alur recruiter"
        accent="bg-one-gradient"
        steps={[
          { title: "Buat lowongan", text: "Pilih template jabatan, kompetensi, dan bobotnya (total 100%).", href: `${BASE}/jobs`, icon: "briefcase" },
          { title: "Susun pertanyaan", text: "Tinjau saran pertanyaan per kompetensi, edit, lalu publikasikan.", href: `${BASE}/builder`, icon: "wand" },
          { title: "Jalankan wawancara", text: "Undang kandidat, atau coba sendiri wawancaranya lewat Portal Kandidat.", href: `${BASE}/portal`, icon: "user" },
          { title: "Tinjau laporan bukti", text: "Cek kutipan jawaban per kompetensi, beri catatan, lalu tandai selesai ditinjau.", href: `${BASE}/reports`, icon: "filesearch" },
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
      <PageHeader title="Lowongan" description="Atur posisi dan kompetensi berbobot yang menjadi dasar rubrik penilaian." />
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
        description="Susun pertanyaan per kompetensi, atur follow-up, lalu publikasikan ke kandidat."
      />
      <InterviewBuilder jobId={jobId} onJobChange={(id) => router.replace(`${BASE}/builder?job=${encodeURIComponent(id)}`, { scroll: false })} />
    </>
  );
}

export function InterviewCandidatesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Kandidat" description="Undang kandidat, pantau status wawancara, dan buka laporan berbasis bukti." />
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
        eyebrow={<Badge tone="success">Human-in-the-loop</Badge>}
        title="Laporan berbasis bukti"
        description="Setiap penilaian dikaitkan dengan kutipan jawaban kandidat. Keputusan akhir tetap di tangan recruiter."
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
        description="AI sebagai pendukung keputusan, bukan otoritas perekrutan. Atur tinjauan manusia, privasi, dan retensi data."
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
        eyebrow={<Badge tone="one">Tampilan kandidat</Badge>}
        title="Portal Kandidat"
        description="Simulasikan wawancara dari sisi kandidat, lalu lihat laporannya sebagai recruiter."
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
