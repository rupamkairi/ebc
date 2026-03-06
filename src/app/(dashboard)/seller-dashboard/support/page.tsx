"use client";

import { Phone, Mail, MessageCircle, ChevronDown, Bell } from "lucide-react";
import { useState } from "react";
import { NotificationInbox } from "@/components/dashboard/notifications/notification-inbox";
import { useAssignmentsQuery } from "@/queries/activityQueries";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { ACTIVITY_TYPE } from "@/constants/enums";
import { useLanguage } from "@/hooks/useLanguage";

const faqs = [
  {
    q: "How do I update my product prices in bulk?",
    a: "You can go to 'My Catalog' and use the 'Bulk Update' feature to download your items as CSV, update the prices, and upload it back.",
  },
  {
    q: "How long does it take to settle my payments?",
    a: "Payments are typically settled within 3-5 business days after the successful delivery and customer confirmation of the order.",
  },
  {
    q: "What if a customer rejects the material upon delivery?",
    a: "In case of rejection, the material will be returned to your warehouse. You should contact our logistics partner or support team to file a claim if there was any damage during transit.",
  },
  {
    q: "How can I increase my 'Vishwas Score'?",
    a: "The score is based on quick response times to enquiries, order fulfillment accuracy, and positive customer ratings. Replying faster usually yields 3X more business!",
  },
  {
    q: "How do I set bulk product prices?",
    a: "Navigate to My Catalog, select multiple products, and use the Bulk Price Edit option in the Actions menu to update prices simultaneously.",
  },
];

const contactChannels = [
  {
    icon: MessageCircle,
    title: "Whatsapp Support",
    sub: "Respond time: 8 - 12 hrs",
    btnLabel: "Chat With Us",
    href: "https://wa.me/919999999999",
  },
  {
    icon: Mail,
    title: "E-Mail Support",
    sub: "support@ebc.com",
    btnLabel: "Email Us",
    href: "mailto:support@ebc.com",
  },
  {
    icon: Phone,
    title: "Call Support",
    sub: "9 am - 6 pm Only",
    btnLabel: "Call Us",
    href: "tel:+919999999999",
  },
];

export default function SupportPage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const { data: entities = [] } = useEntitiesQuery();
  const sellerEntity = entities[0];
  const { data: enquiryAssignments = [] } = useAssignmentsQuery({
    toEntityId: sellerEntity?.id,
    type: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
  });
  const respondedEnquiryIds = new Set(
    enquiryAssignments
      .filter((a) => a.enquiry?.status && a.enquiry.status !== "PENDING")
      .map((a) => a.enquiry!.id),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="lg:col-span-3 flex flex-col gap-6 md:gap-8 pb-8">
        {/* Contact Channel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactChannels.map(({ icon: Icon, title, sub, btnLabel, href }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #3D52A0 0%, #2a3a7c 100%)",
              }}
            >
              <div className="shrink-0 h-14 w-14 rounded-xl bg-white flex items-center justify-center shadow-md">
                <Icon size={28} className="text-[#3D52A0]" />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <h3 className="text-white font-black text-base leading-tight">
                  {title}
                </h3>
                <p className="text-white/60 text-xs font-medium truncate">
                  {sub}
                </p>
                <span className="inline-block self-start bg-[#FFA500] hover:bg-[#e69500] text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors">
                  {btnLabel}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Submit a Ticket */}
          <div
            className="rounded-2xl p-6 md:p-8 flex flex-col gap-5"
            style={{
              background: "linear-gradient(145deg, #3D52A0 0%, #2a3a7c 100%)",
            }}
          >
            <div>
              <h2 className="text-white text-2xl font-black">
                {t("submit_ticket")}
              </h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-[#FFA500]" />
            </div>

            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Issue Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {t("issue_category")}
                </label>
                <input
                  type="text"
                  placeholder={t("write_subject_of_issue")}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500]/20 transition-all"
                />
              </div>

              {/* Describe Problem */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                  {t("describe_your_problem")}
                </label>
                <textarea
                  placeholder={t("write_subject_of_issue")}
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm outline-none focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500]/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFA500] hover:bg-[#e69500] active:scale-95 text-white font-black py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 shadow-lg shadow-orange-300/20"
              >
                {t("submit_your_ticket")}
              </button>
            </form>
          </div>

          {/* Common Questions / FAQ */}
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-[#1e2b6b] text-2xl font-black">
                {t("common_questions")}
              </h2>
              <div className="mt-2 h-0.5 w-12 rounded-full bg-[#FFA500]" />
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left rounded-xl border border-[#e8ecf4] bg-white px-5 py-4 transition-all duration-200 hover:border-[#3D52A0]/30 hover:shadow-sm focus:outline-none"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-[#1e2b6b] leading-snug">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#3D52A0] transition-transform duration-300 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {openFaq === i && (
                    <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500 font-medium leading-relaxed animate-in slide-in-from-top-2 duration-200">
                      {faq.a}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {/* Still have questions? */}
            <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-400 mb-3">
                {t("still_have_questions")}
              </p>
              <a
                href="mailto:support@ebc.com"
                className="inline-block border-2 border-[#3D52A0] text-[#3D52A0] font-black text-sm px-8 py-2.5 rounded-full hover:bg-[#3D52A0] hover:text-white transition-all duration-200"
              >
                {t("view_full_knowledge_base")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
