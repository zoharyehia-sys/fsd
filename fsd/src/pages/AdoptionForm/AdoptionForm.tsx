import { FC, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pet } from "../../types";
import styles from "./AdoptionForm.module.scss";
import ImageWithFallback from "../../components/ImageWithFallback/ImageWithFallback";

const AdoptionForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigatedPetId = location.state?.selectedPetId;

  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  useEffect(() => {
    fetch("/data/pets.json")
      .then((res) => res.json())
      .then((data: Pet[]) => {
        setAllPets(data);
        if (navigatedPetId) {
          const found = data.find(
            (p) => String(p.id) === String(navigatedPetId),
          );
          if (found) setSelectedPet(found);
        }
      })
      .catch((err) => console.error("Load error:", err))
      .finally(() => setLoading(false));
  }, [navigatedPetId]);

  const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pet = allPets.find((p) => String(p.id) === e.target.value);
    setSelectedPet(pet || null);
  };

  const validate = () => {
    const errs: Partial<typeof formData> = {};
    if (!formData.fullName.trim()) errs.fullName = "שם מלא חסר";
    if (!formData.address.trim()) errs.address = "כתובת חסרה";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "אימייל לא תקין";
    if (formData.phone.length < 9) errs.phone = "טלפון לא תקין";
    setErrors(errs);
    return Object.keys(errs).length === 0 && selectedPet !== null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      if (!selectedPet) alert("בבקשה בחר חיה מהרשימה");
      return;
    }

    alert(
      `בקשת אימוץ עבור: ${selectedPet?.firstName}\n\nפרטי המאמץ:\nשם: ${formData.fullName}\nכתובת: ${formData.address}\nאימייל: ${formData.email}\nטלפון: ${formData.phone}`,
    );
    navigate("/catalog");
  };

  if (loading) return <div className={styles.loader}>טוען...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.visualSide}>
          <div className={styles.petOverlay}>
            <label>בחר חבר חדש:</label>
            <select
              value={selectedPet?.id || ""}
              onChange={handlePetChange}
              className={styles.petSelect}
            >
              <option value="" disabled>
                -- רשימת החיות --
              </option>
              {allPets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName}
                </option>
              ))}
            </select>
            <br />
            <br />

            <div className={styles.imageWrapper}>
              <ImageWithFallback
                src={selectedPet?.pictureUrl}
                className={styles.petImg}
              />
            </div>

            {selectedPet && (
              <div className={styles.detailsGrid}>
                <span>
                  <strong>סוג:</strong> {selectedPet.animalType}
                </span>
                <span>
                  <strong>מין:</strong> {selectedPet.gender}
                </span>
                <span>
                  <strong>גיל:</strong>{" "}
                  {new Date().getFullYear() - selectedPet.birthYear} שנים
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formSide}>
          <h2>טופס אימוץ</h2>
          <p className={styles.subtitle}>
            כמעט שם! מלאו את הפרטים ונחזור אליכם.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>שם מלא</label>
              <input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={errors.fullName ? styles.inputError : ""}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>כתובת מגורים</label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className={errors.address ? styles.inputError : ""}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>אימייל</label>
              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? styles.inputError : ""}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>טלפון</label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={errors.phone ? styles.inputError : ""}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              שלח בקשה
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdoptionForm;
