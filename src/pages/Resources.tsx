import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Heart,
  Link as LinkIcon,
  Mail,
  Phone,
  PlusCircle,
  Search,
  Shield,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const db = getFirestore();

const ADMIN_EMAILS = [
  "safevoiceforwomen@gmail.com",
  "piyushydv011@gmail.com",
  "aditiraj0205@gmail.com",
];

interface NGO {
  id: string;
  name: string;
  description: string;
  contact?: string;
  email?: string;
  website?: string;
  registration_number?: string;
  approved?: boolean;
  category?: string;
}

interface SafetySection {
  title: string;
  points: string[];
}

const SAFETY_GUIDE: SafetySection[] = [
  {
    title: "Public Transport Safety",
    points: [
      "Stand near the driver, conductor, or other families whenever possible.",
      "Share your live location with a trusted contact during late-night travel.",
      "Move away immediately if someone invades your personal space.",
      "Use emergency helplines (112) if you feel threatened.",
    ],
  },
  {
    title: "Workplace Harassment",
    points: [
      "Document dates, messages, and incidents.",
      "Report concerns to HR or the Internal Complaints Committee (ICC).",
      "Preserve screenshots and emails as evidence.",
      "Seek legal support if the issue is ignored.",
    ],
  },
  {
    title: "Unsafe Friend Groups or Parties",
    points: [
      "Never leave your drink unattended.",
      "Use a pre-decided code word with trusted friends.",
      "Leave immediately if you feel pressured or unsafe.",
      "Arrange your own transportation when possible.",
    ],
  },
  {
    title: "Digital Harassment & Blackmail",
    points: [
      "Do not engage with threats or demands.",
      "Take screenshots and save all evidence.",
      "Report the account to the platform.",
      "File a cybercrime complaint at cybercrime.gov.in.",
    ],
  },
  {
    title: "Being Followed or Stalked",
    points: [
      "Go to a crowded public place immediately.",
      "Call a trusted person and stay on the line.",
      "Avoid going directly home.",
      "Contact police if the person continues following you.",
    ],
  },
  {
    title: "After Sexual Assault or Attempted Assault",
    points: [
      "Move to a safe location and call someone you trust.",
      "Seek medical attention as soon as possible.",
      "Preserve clothing and evidence if you choose to report.",
      "Reach out to a counselor or survivor support organization.",
    ],
  },
];
import { QUICK_HELPLINES } from "../utils/constants";
function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm dark:border-pink-800 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between bg-pink-50 px-5 py-4 text-left font-semibold text-pink-800 dark:bg-pink-950/40 dark:text-pink-200"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {open && (
        <div className="px-5 py-4 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
}

function NGOCard({
  ngo,
  isAdmin,
  onDelete,
}: {
  ngo: NGO;
  isAdmin: boolean;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {isAdmin && (
        <button
          type="button"
          onClick={() => onDelete(ngo.id, ngo.name)}
          className="absolute right-4 top-4 rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
          aria-label={`Delete ${ngo.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {ngo.name}
        </h3>
        <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
          {ngo.category || "General"}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
        <CheckCircle className="h-4 w-4" /> Verified Partner
      </div>

      <p className="mb-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {ngo.description}
      </p>

      <div className="space-y-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
        {ngo.contact && (
          <a
            href={`tel:${ngo.contact}`}
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400"
          >
            <Phone className="h-4 w-4" />
            {ngo.contact}
          </a>
        )}

        {ngo.email && (
          <a
            href={`mailto:${ngo.email}`}
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400"
          >
            <Mail className="h-4 w-4" />
            {ngo.email}
          </a>
        )}

        {ngo.website && (
          <a
            href={ngo.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-pink-600 hover:underline dark:text-pink-400"
          >
            <LinkIcon className="h-4 w-4" />
            Visit Website
          </a>
        )}

        {isAdmin && ngo.registration_number && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Users className="h-3 w-3" />
            Reg No: {ngo.registration_number}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Resources() {
  const navigate = useNavigate();

  const [user, setUser] = useState(auth.currentUser);
  const [ngos, setNGOs] = useState<NGO[]>([]);
  const [loadingNGOs, setLoadingNGOs] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleNGOs, setVisibleNGOs] = useState(12);

  const [ngoName, setNGOName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const isAdmin = !!(
    user && ADMIN_EMAILS.includes(user.email || "")
  );

  useEffect(() => {
    const fetchNGOs = async () => {
      setLoadingNGOs(true);
      try {
        const q = query(
          collection(db, "ngos"),
          where("approved", "==", true)
        );

        const snapshot = await getDocs(q);

        const list: NGO[] = snapshot.docs.map((document) => {
          const data = document.data();
          return {
            id: document.id,
            name: data.name,
            description: data.description,
            contact: data.contact,
            email: data.email,
            website: data.website,
            registration_number: data.registration_number,
            approved: data.approved,
            category: data.category || "General",
          };
        });

        list.sort((a, b) => a.name.localeCompare(b.name));
        setNGOs(list);
      } catch (error) {
        console.error("Error fetching NGOs:", error);
        toast.error("Could not load NGOs.");
      } finally {
        setLoadingNGOs(false);
      }
    };

    fetchNGOs();
  }, []);

  const filteredNGOs = useMemo(() => {
    return ngos.filter((ngo) => {
      const matchesSearch =
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (ngo.category || "General") === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [ngos, searchQuery, selectedCategory]);

  const handleDeleteNGO = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      return;
    }

    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      await deleteDoc(doc(db, "ngos", id));
      setNGOs((prev) => prev.filter((ngo) => ngo.id !== id));
      toast.success(`${name} deleted.`, { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(`Failed to delete ${name}.`, { id: toastId });
    }
  };

  const handleShowMore = () => {
    setVisibleNGOs((prev) => prev + 12);
  };

  const handleNGORequest = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("Please sign in to submit a request.");
      navigate("/auth");
      return;
    }

    if (
      !ngoName.trim() ||
      !description.trim() ||
      !contact.trim() ||
      !email.trim() ||
      !registrationNumber.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoadingRequest(true);

    try {
      await addDoc(collection(db, "ngo_requests"), {
        name: ngoName,
        description,
        contact,
        email,
        registration_number: registrationNumber,
        user_id: currentUser.uid,
        created_at: serverTimestamp(),
        approved: false,
      });

      toast.success("Your request has been submitted successfully.");

      setNGOName("");
      setDescription("");
      setContact("");
      setEmail("");
      setRegistrationNumber("");
    } catch (error) {
      console.error("Error submitting NGO request:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24 pt-16 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl space-y-20 px-6">
        <header className="pt-8 text-center">
          <h1 className="mb-4 text-5xl font-extrabold md:text-6xl">
            <span className="bg-gradient-to-r from-pink-600 to-rose-700 bg-clip-text text-transparent">
              Verified Support Network
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
            Find verified NGOs, emergency helplines, legal information, and
            practical safety guidance.
          </p>
        </header>
        <section>
  <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
    Quick Access Helplines ⚡
  </h2>

  {/* Responsive grid for 8 helpline cards */}
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {QUICK_HELPLINES.map((item) => {
      const Icon = item.icon;

      // Extract the first number for clickable tel links
      // Example: "1091 / 181" -> "1091"
      const primaryNumber = item.number
        .split(" /")[0]
        .replace(/[^0-9+]/g, "");

      return (
        <a
          key={item.title}
          href={`tel:${primaryNumber}`}
          className="rounded-3xl border border-pink-200 bg-white p-6 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-pink-900 dark:bg-gray-800"
        >
          <Icon className="mx-auto mb-4 h-10 w-10 text-pink-600 dark:text-pink-400" />

          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {item.title}
          </h3>

          {/* Slightly smaller text to fit longer numbers */}
          <p className="mt-2 break-words text-2xl font-extrabold text-pink-600 dark:text-pink-400">
            {item.number}
          </p>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {item.description}
          </p>
        </a>
      );
    })}
  </div>
</section>

        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Safety & Support Guide 🛡️
          </h2>

          <div className="grid gap-5">
            {SAFETY_GUIDE.map((section, index) => (
              <Accordion
                key={section.title}
                title={section.title}
                defaultOpen={index === 0}
              >
                <ul className="list-disc space-y-2 pl-5">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Accordion>
            ))}
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-pink-200 bg-pink-50 p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center gap-3 border-b border-pink-300 pb-3 dark:border-gray-700">
              <Shield className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Personal Safety Hub
              </h2>
            </div>

            <div className="space-y-4">
              <Accordion title="Personal Safety Protocols" defaultOpen>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Trust your instincts if something feels wrong.</li>
                  <li>Share your route and ETA with a trusted contact.</li>
                  <li>Keep your phone charged.</li>
                  <li>Use emergency SOS features on your phone.</li>
                </ul>
              </Accordion>

              <Accordion title="Digital Security Checklist">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Enable two-factor authentication.</li>
                  <li>Audit app permissions regularly.</li>
                  <li>Use strong, unique passwords.</li>
                  <li>Be cautious with unknown links and attachments.</li>
                </ul>
              </Accordion>
            </div>
          </div>

          <div className="rounded-3xl border border-pink-200 bg-pink-50 p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center gap-3 border-b border-pink-300 pb-3 dark:border-gray-700">
              <BookOpen className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Legal & Emotional Healing Hub
              </h2>
            </div>

            <div className="space-y-4">
              <Accordion title="Know Your Legal Rights ⚖️" defaultOpen>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Protection of Women from Domestic Violence Act, 2005.</li>
                  <li>Right to free legal aid.</li>
                  <li>Right to confidentiality during investigations.</li>
                </ul>
              </Accordion>

              <Accordion title="Therapy & Recovery Paths 🧘‍♀️">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Seek trauma-informed counseling.</li>
                  <li>Join survivor support groups.</li>
                  <li>Practice grounding and self-care techniques.</li>
                </ul>
              </Accordion>

              <Accordion title="Community & Empowerment 💪">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Build financial independence and support networks.</li>
                  <li>Attend workshops and awareness programs.</li>
                  <li>Connect with advocacy communities.</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
            <PlusCircle className="h-7 w-7 text-pink-600 dark:text-pink-400" />
            Request NGO Collaboration
          </h2>

          <Accordion title="Add Your NGO to Our Verified Support Network">
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Represent a verified NGO? Submit your details for review.
            </p>

            <form onSubmit={handleNGORequest} className="space-y-5">
              <input
                type="text"
                placeholder="NGO Name"
                value={ngoName}
                onChange={(e) => setNGOName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />

              <textarea
                placeholder="Brief Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  type="tel"
                  placeholder="10-digit Contact Number"
                  value={contact}
                  onChange={(e) =>
                    setContact(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />

                <input
                  type="email"
                  placeholder="Official Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Registration Number"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />

              <button
                type="submit"
                disabled={loadingRequest}
                className="rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
              >
                {loadingRequest ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </Accordion>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            NGO Directory 📋
          </h2>

          <div className="mb-8 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-500" />
              <input
                type="text"
                placeholder="Search NGOs by name or mission..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Legal Aid">Legal Aid ⚖️</option>
              <option value="Counseling">Counseling 🧘‍♀️</option>
              <option value="Emergency">Emergency 🚨</option>
              <option value="Shelter">Shelter 🏠</option>
              <option value="General">General 🌍</option>
            </select>
          </div>

          {loadingNGOs ? (
            <p className="py-10 text-center text-gray-500 dark:text-gray-400">
              Loading NGO partners...
            </p>
          ) : filteredNGOs.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredNGOs
                  .slice(0, visibleNGOs)
                  .map((ngo) => (
                    <NGOCard
                      key={ngo.id}
                      ngo={ngo}
                      isAdmin={isAdmin}
                      onDelete={handleDeleteNGO}
                    />
                  ))}
              </div>

              {visibleNGOs < filteredNGOs.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={handleShowMore}
                    className="rounded-full bg-gradient-to-r from-pink-500 to-rose-600 px-8 py-3 font-bold text-white shadow-lg"
                  >
                    Load More ({filteredNGOs.length - visibleNGOs} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="py-10 text-center text-gray-500 dark:text-gray-400">
              No NGOs match your search.
            </p>
          )}
        </section>
        <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
    Report Abuse & File Complaints Online 🌐
  </h2>

  <p className="text-gray-600 dark:text-gray-300 mb-8">
    Use these official government portals to report cybercrime, workplace
    harassment, domestic violence, and other safety concerns.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      {
        title: "National Cyber Crime Portal",
        description:
          "Report online harassment, blackmail, stalking, and cyber abuse.",
        url: "https://cybercrime.gov.in",
      },
      {
        title: "National Commission for Women (NCW)",
        description:
          "File complaints related to domestic violence, harassment, and abuse.",
        url: "https://www.ncw.gov.in/other-useful-helplines/",
      },
      {
        title: "SHE-Box",
        description:
          "Official portal to report sexual harassment at the workplace.",
        url: "https://shebox.wcd.gov.in",
      },
      {
        title: "National Legal Services Authority (NALSA)",
        description:
         "Access free legal aid and legal services for eligible individuals.",
       url: "https://nalsa.gov.in",
},
    ].map((resource, index) => (
      <a
        key={index}
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-pink-50 dark:bg-gray-700 border border-pink-200 dark:border-gray-600 rounded-2xl p-6 hover:shadow-lg hover:scale-[1.02] transition"
      >
        <h3 className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-2">
          {resource.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {resource.description}
        </p>
        <span className="text-pink-600 dark:text-pink-400 font-semibold">
          Visit Website →
        </span>
      </a>
    ))}
  </div>
</section>

        <section className="text-center">
          <div className="inline-block rounded-2xl border border-pink-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              Connect With Us
            </h2>
            <p className="mb-3 text-gray-600 dark:text-gray-300">
              We are here to help and expand our support network.
            </p>
            <a
              href="mailto:safevoiceforwomen@gmail.com"
              className="inline-flex items-center gap-2 font-semibold text-pink-600 hover:underline dark:text-pink-400"
            >
              <Mail className="h-5 w-5" />
              safevoiceforwomen@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
