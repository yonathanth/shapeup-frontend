"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { potentialCustomersApi, servicesApi, type Service } from "@/lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

function RegisterContent() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    remark: "",
    objective: "",
  });
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.getAll();
        setServices(response.data || []);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const pkg = searchParams.get("package");
    if (pkg && services.length > 0) {
      const match = services.find(s => s.name === pkg);
      if (match) setSelectedServiceId(match.id.toString());
    }
  }, [searchParams, services]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await potentialCustomersApi.register({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        serviceId: selectedServiceId ? Number(selectedServiceId) : undefined,
        remark: formData.remark || undefined,
        objective: formData.objective || undefined,
      });

      setSuccess(true);
      setFormData({ fullName: "", phoneNumber: "", remark: "", objective: "" });
      setSelectedServiceId("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white font-jost selection:bg-customBlue selection:text-black min-h-screen">
      <Header />

      <main className="flex w-full flex-col pt-20">
        <section className="bg-background py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1440px] px-6">
            <div className="mx-auto max-w-2xl bg-white/5 border border-white/10 p-10">
              <div className="mb-10">
                <p className="text-xs font-black uppercase italic tracking-widest text-primary">
                  Your details
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase italic tracking-tighter md:text-5xl">
                  LET&apos;S START
                </h2>
                <p className="mt-4 text-sm font-medium uppercase italic leading-relaxed text-white/60">
                  Fill in the form — we handle the rest.
                </p>
              </div>

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Full Name</span>
                    <input
                      className="h-12 w-full border-2 border-primary/10 bg-background px-4 text-white placeholder-white/30 transition-all focus:border-primary focus:outline-none"
                      placeholder="e.g. Abebe Bikila"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-white/60">Phone Number</span>
                    <input
                      className="h-12 w-full border-2 border-primary/10 bg-background px-4 text-white placeholder-white/30 transition-all focus:border-primary focus:outline-none"
                      placeholder="+251 911 000 000"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-white/60">Membership Package (optional)</span>
                  <select
                    className="h-12 w-full cursor-pointer appearance-none border-2 border-primary/10 bg-background px-4 text-white transition-all focus:border-primary focus:outline-none"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                  >
                    <option value="">Select a package</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} {service.price ? `- ${service.price.toLocaleString()} ETB` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-white/60">Objective (optional)</span>
                  <select
                    className="h-12 w-full cursor-pointer appearance-none border-2 border-primary/10 bg-background px-4 text-white transition-all focus:border-primary focus:outline-none"
                    name="objective"
                    value={formData.objective}
                    onChange={handleInputChange}
                  >
                    <option value="">Select objective</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Weight Gain">Weight Gain</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Speed">Speed</option>
                    <option value="Strength / Power">Strength / Power</option>
                    <option value="Cardiovascular Development">Cardiovascular Development</option>
                    <option value="Others">Others</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-white/60">Remark (optional)</span>
                  <textarea
                    className="min-h-[96px] w-full border-2 border-primary/10 bg-background px-4 py-3 text-white placeholder-white/30 transition-all focus:border-primary focus:outline-none"
                    placeholder="Notes or remarks"
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </label>

                {error && (
                  <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <button
                  className="mt-4 flex h-14 w-full items-center justify-center gap-2 bg-primary text-lg font-black uppercase tracking-tighter text-on-primary transition-transform hover:-translate-y-1 hover:translate-x-1 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Register Today</span>
                      <span className="material-symbols-outlined transition-transform">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md border-4 border-primary bg-surface-dark p-8 text-center shadow-xl">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center border-2 border-emerald-500/50 bg-emerald-500/20">
              <span className="material-symbols-outlined text-emerald-400 text-4xl">check_circle</span>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Registration successful!</h3>
            <p className="mb-6 text-sm text-white/70">
              We&apos;ll contact you soon. Welcome to ShapeUp!
            </p>
            <button
              type="button"
              onClick={() => router.push(`/${locale}`)}
              className="flex h-12 w-full items-center justify-center gap-2 bg-primary font-black uppercase tracking-wider text-on-primary transition-colors hover:bg-primary/90"
            >
              <span>Back to Home</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background text-on-background font-body px-6 py-24 text-center">
          <div className="text-white/60">Loading...</div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
