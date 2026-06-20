import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import AvatarDisplay from "../components/common/AvatarDisplay";
import { useProfile } from "../hooks/useProfile";
import { reviewService } from "../services/teamService";
import { DOMAIN_ICONS, COMMITMENT_LABELS } from "../data/constants";
import { Linkedin, Globe, Github, Zap, Star, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { profile, loading } = useProfile(id);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", tags: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    reviewService.getReviews(id)
      .then(res => { setReviews(res.data.reviews); setAvgRating(res.data.average_rating); })
      .catch(() => {});
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewService.createReview(id, reviewForm);
      toast.success("Review submitted!");
      const res = await reviewService.getReviews(id);
      setReviews(res.data.reviews);
      setAvgRating(res.data.average_rating);
      setReviewForm({ rating: 5, comment: "", tags: [] });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    } finally { setSubmitting(false); }
  };

  const REVIEW_TAGS = ["reliable", "skilled", "communicative", "creative", "fast", "mentor"];
  const toggleTag = (tag) => setReviewForm(p => ({
    ...p,
    tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag],
  }));

  if (loading) return <div className="min-h-screen page-bg flex items-center justify-center text-slate-400">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <div className="card mb-5">
          <div className="flex items-start gap-4">
            <AvatarDisplay user={profile} size={64} className="shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-xl font-bold">{profile.full_name}</h1>
                  <p className="text-slate-400 text-sm">{profile.department} · Year {profile.year_of_study}</p>
                  <p className="text-slate-500 text-sm">{profile.institution}</p>
                  {profile.roll_number && <p className="text-slate-500 text-xs">#{profile.roll_number}</p>}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {profile.is_looking_for_team && <span className="badge-green text-xs">✓ Looking for team</span>}
                  <span className="badge-purple text-xs">{COMMITMENT_LABELS[profile.commitment_level]}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm">
                    <Linkedin size={14}/> LinkedIn
                  </a>
                )}
                {profile.portfolio_url && (
                  <a href={profile.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm">
                    <Globe size={14}/> Portfolio
                  </a>
                )}
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm">
                    <Github size={14}/> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {profile.skills?.length > 0 && (
          <div className="card mb-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Zap size={16} className="text-yellow-400"/> Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => <span key={s.id} className="badge-purple">{s.name}</span>)}
            </div>
          </div>
        )}

        {profile.interests?.length > 0 && (
          <div className="card mb-5">
            <h2 className="font-semibold mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(i => (
                <span key={i.id} className="badge-green">
                  {DOMAIN_ICONS[i.category] || "⚡"} {i.category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="card mb-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Star size={15} className="text-amber-400 fill-amber-400" />
              Reviews
              <span className="badge-yellow text-xs ml-1">{avgRating} / 5</span>
            </h2>
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12}
                        className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                    ))}
                    <span className="text-slate-500 text-xs ml-auto">{r.reviewer?.full_name}</span>
                  </div>
                  {r.comment && <p className="text-slate-300 text-sm">{r.comment}</p>}
                  {r.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.tags.map(t => <span key={t} className="badge-cyan text-[10px]">{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Write Review */}
        {currentUser && String(currentUser.id) !== String(id) && (
          <div className="card">
            <h2 className="font-semibold mb-4 text-sm">Leave a Review</h2>
            <form onSubmit={submitReview} className="space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button type="button" key={n} onClick={() => setReviewForm(p => ({...p, rating: n}))}
                    className="transition-colors">
                    <Star size={20} className={n <= reviewForm.rating
                      ? "text-amber-400 fill-amber-400" : "text-slate-600"} />
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {REVIEW_TAGS.map(tag => (
                  <button type="button" key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      reviewForm.tags.includes(tag)
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
                        : "border-white/10 text-slate-500 hover:border-white/20"}`}>
                    {tag}
                  </button>
                ))}
              </div>
              <textarea className="input resize-none text-sm" rows={2}
                placeholder="Write a comment (optional)..."
                value={reviewForm.comment}
                onChange={e => setReviewForm(p => ({...p, comment: e.target.value}))} />
              <button type="submit" disabled={submitting} className="btn-primary text-sm w-full">
                <Send size={14} /> {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
