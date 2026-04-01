import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "./Navbar";
import {
  addPayment,
  getPayments,
  deletePayment,
  updatePayment,
} from "../utils/Storage";
import "../Styles/Dashboard.css";

/*  Helpers  */
const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const statusClass = (s) =>
  s === "paid" ? "paid" : s === "pending" ? "pending" : "failed";

/*  Component */
function Dashboard() {
  const [title,    setTitle]    = useState("");
  const [amount,   setAmount]   = useState("");
  const [status,   setStatus]   = useState("pending");
  const [payments, setPayments] = useState([]);
  const [editId,   setEditId]   = useState(null);

  const heroRefs = useRef([]);
  const formRef  = useRef(null);
  const cardRefs = useRef([]);

  /*  Logic (untouched)  */
  const fetchPayments = () => setPayments(getPayments());

  useEffect(() => {
    fetchPayments();

    gsap.from(heroRefs.current, {
      opacity: 1,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.15,
      ease: "power3.out",
    });

    gsap.from(formRef.current, {
      opacity: 1,
      x: -30,
      duration: 0.7,
      delay: 0.3,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length) {
      gsap.from(cards, {
        opacity: 0,
        x: 20,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [payments]);

  const handleSubmit = (e) => {
    e.preventDefault();

    gsap.to(e.currentTarget.querySelector(".mt-btn-submit"), {
      scale: 0.96,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
    });

    if (editId) {
      updatePayment(editId, { title, amount, status });
      setEditId(null);
    } else {
      addPayment({ title, amount, status, date: new Date().toISOString() });
    }

    fetchPayments();
    setTitle("");
    setAmount("");
    setStatus("pending");
  };

  const handleDelete = (id, cardEl) => {
    gsap.to(cardEl, {
      opacity: 0,
      x: 40,
      height: 0,
      marginBottom: 0,
      padding: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        deletePayment(id);
        fetchPayments();
      },
    });
  };

  const startEdit = (p) => {
    setTitle(p.title);
    setAmount(p.amount);
    setStatus(p.status);
    setEditId(p.id);

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });

    gsap.fromTo(
      formRef.current,
      { boxShadow: "0 0 0 2px rgba(91,159,255,0)" },
      { boxShadow: "0 0 0 2px rgba(91,159,255,0.45)", duration: 0.3, yoyo: true, repeat: 1 }
    );
  };

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setAmount("");
    setStatus("pending");
  };

  /*  Derived values  */
  const total   = payments.reduce((s, p) => s + Number(p.amount), 0);
  const paid    = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const pending = payments.filter((p) => p.status === "pending").length;

  /*  JSX  */
  return (
    <div>
      {/* Ambient background orbs */}
      <div className="mt-orbs">
        <div className="mt-orb mt-orb1" />
        <div className="mt-orb mt-orb2" />
        <div className="mt-orb mt-orb3" />
      </div>

      <Navbar />

      <div className="mt-app">

        {/*  Stat Cards  */}
        <div className="mt-hero">
          {[
            { mod: "mt-hc-total",   label: "Total Balance", value: `₹${total.toLocaleString("en-IN")}`, color: "gold",  icon: "💰" },
            { mod: "mt-hc-paid",    label: "Paid Amount",   value: `₹${paid.toLocaleString("en-IN")}`,  color: "green", icon: "✓"  },
            { mod: "mt-hc-pending", label: "Pending Items", value: pending,                              color: "red",   icon: "⏳" },
          ].map((card, i) => (
            <div
              key={i}
              className={`mt-hc ${card.mod}`}
              ref={(el) => (heroRefs.current[i] = el)}
            >
              <div className="mt-hc-label">{card.label}</div>
              <div className={`mt-hc-value ${card.color}`}>{card.value}</div>
              <div className="mt-hc-icon">{card.icon}</div>
            </div>
          ))}
        </div>

        {/*  Main Two-Column Grid  */}
        <div className="mt-main">

          {/* Form Panel */}
          <div className="mt-form-card" ref={formRef}>
            <div style={{ marginBottom: 24 }}>
              <div className="mt-fc-title">
                {editId ? "✏️ Edit Payment" : "＋ New Payment"}
              </div>
              <div className="mt-fc-sub">
                {editId ? "Update existing record" : "Add a transaction"}
              </div>
            </div>

            <div className="mt-line" />

            <form onSubmit={handleSubmit}>
              <div className="mt-field">
                <label className="mt-field-label">Title</label>
                <input
                  className="mt-input"
                  placeholder="e.g. Netflix Subscription"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mt-field">
                <label className="mt-field-label">Amount (₹)</label>
                <input
                  className="mt-input"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mt-field">
                <label className="mt-field-label">Status</label>
                <select
                  className="mt-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <button
                type="submit"
                className={`mt-btn-submit ${editId ? "upd" : "add"}`}
              >
                {editId ? "Update" : "Add"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="mt-btn-cancel"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* Transaction List */}
          <div>
            <div className="mt-list-head">
              <div className="mt-list-title">Transactions</div>
              <div className="mt-count">
                {payments.length} record{payments.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="mt-list">
              {payments.length === 0 ? (
                <div className="mt-empty">
                  <div className="mt-empty-icon">📭</div>
                  <div>No transactions yet</div>
                </div>
              ) : (
                payments.map((p, i) => (
                  <div
                    key={p.id}
                    className="mt-card"
                    ref={(el) => (cardRefs.current[i] = el)}
                  >
                    <div className={`mt-stripe ${statusClass(p.status)}`} />

                    <div>
                      <div className="mt-card-title">{p.title}</div>
                      <div className="mt-card-date">{formatDate(p.date)}</div>
                    </div>

                    <div className="mt-amount-col">
                      <div className="mt-amount">
                        ₹{Number(p.amount).toLocaleString("en-IN")}
                      </div>
                      <div className={`mt-badge ${statusClass(p.status)}`}>
                        {p.status}
                      </div>
                    </div>

                    <div className="mt-actions">
                      <button
                        className="mt-btn-icon edit"
                        onClick={() => startEdit(p)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="mt-btn-icon del"
                        onClick={() => handleDelete(p.id, cardRefs.current[i])}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;