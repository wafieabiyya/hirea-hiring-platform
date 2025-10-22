import CandidatesClientLoader from "./ClientLoader";

export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <CandidatesClientLoader jobIdParam={jobId} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return { title: `Job ${jobId} • Candidates` };
}
