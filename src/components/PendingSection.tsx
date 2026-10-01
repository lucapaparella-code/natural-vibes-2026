export default function PendingSection({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto paper-card px-6 py-12 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-foreground">{title}</h2>
          <p className="mt-6 text-4xl sm:text-5xl font-heading font-black text-primary tracking-widest">TBA</p>
        </div>
      </div>
    </section>
  );
}
