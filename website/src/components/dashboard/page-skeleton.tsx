/** Loading placeholder shown while a dashboard page reads its URL parameters. */
export function PageSkeleton() {
  return (
    <div aria-hidden className="space-y-6">
      <div className="space-y-2">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <div className="skeleton h-4 w-96 max-w-full rounded-md" />
      </div>
      <div className="skeleton h-[420px] rounded-2xl" />
    </div>
  );
}
