import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function ProfilePage() {
  const defaultValues = {
    name: "",
    bio: "",
    email: "",
    skills: "React,Node",
    config: {
      mode: "view",
    },
  };

  const methods = useForm({ defaultValues });
  const { watch, reset, setValue, register, handleSubmit } = methods;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    axios
      .get("http://localhost:4000/users/profile/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const { user, profile } = res.data || {};
        reset({
          name: user?.name || "",
          email: user?.email || "",
          bio: profile?.bio || "",
          skills: (profile?.skills || []).map((s: any) => s?.name).filter(Boolean).join(", ") || "",
          config: { mode: "view" },
        });
      })
      .catch(() => {});
  }, [reset]);

  const onSubmit = (form: any) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    axios
      .put(
        "http://localhost:4000/users/profile",
        {
          name: form.name,
          email: form.email,
          bio: form.bio,
          skills: form.skills,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        const { user, profile } = res.data || {};
        reset({
          name: user?.name || "",
          email: user?.email || "",
          bio: profile?.bio || "",
          skills: (profile?.skills || []).map((s: any) => s?.name).filter(Boolean).join(", ") || "",
          config: { mode: "view" },
        });
      })
      .catch(() => {});
  };

  const data = watch();

  const OnClickEdit = () => {
    setValue("config.mode", "edit");
  };

  const GoBackButton = () => {
    setValue("config.mode", "view");
  };

  return (
    <div className="stack" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700" }}>Profile</h1>
          {data?.config?.mode === "view" && (
            <button onClick={OnClickEdit} className="btn btn-outline">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {data?.config?.mode === "view" && (
        <div className="card">
          <div className="stack">
            <div>
              <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-muted)" }}>Full Name</label>
              <p style={{ margin: "0.25rem 0 1rem 0", fontSize: "1.1rem", fontWeight: "500" }}>{data?.name || "Not provided"}</p>
            </div>
            <div>
              <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-muted)" }}>Email Address</label>
              <p style={{ margin: "0.25rem 0 1rem 0", fontSize: "1.1rem", fontWeight: "500" }}>{data?.email || "Not provided"}</p>
            </div>
            <div>
              <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-muted)" }}>Bio</label>
              <p style={{ margin: "0.25rem 0 1rem 0", fontSize: "1rem" }}>{data?.bio || "No bio added yet."}</p>
            </div>
            <div>
              <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--color-muted)" }}>Skills</label>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "1rem" }}>{data?.skills || "No skills listed."}</p>
            </div>
          </div>
        </div>
      )}

      {data?.config?.mode === "edit" && (
        <form className="card" onSubmit={handleSubmit(onSubmit)}>
          <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600" }}>Edit Profile</h2>
          <div className="stack">
            <div>
              <label>Full Name</label>
              <input {...register("name")} placeholder="Enter your full name" required />
            </div>
            <div>
              <label>Email Address</label>
              <input {...register("email")} placeholder="Enter your email" required />
            </div>
            <div>
              <label>Bio</label>
              <textarea 
                {...register("bio")} 
                placeholder="Tell us about yourself" 
                rows={4}
                style={{ resize: "vertical", minHeight: "100px" }}
              />
            </div>
            <div>
              <label>Skills</label>
              <input {...register("skills")} placeholder="e.g., React, Node.js, TypeScript" />
            </div>
            <div className="row" style={{ marginTop: "1rem" }}>
              <button type="button" className="btn btn-outline" onClick={GoBackButton}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;