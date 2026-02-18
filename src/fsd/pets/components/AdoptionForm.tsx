import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Loader } from "../../../shared/components";
import { PetService } from "../services/petService";
import type { Pet } from "../../../models/Pet";
import {
  AdoptionFormSchema,
  type AdoptionFormData,
} from "../validation/AdopterSchema";
import styles from "./AdoptionForm.module.scss";

const MALE_HE = "\u05D6\u05DB\u05E8";
const NO_IMAGE_URL =
  "https://placehold.co/600x400?text=%D7%9C%D7%9C%D7%90+%D7%AA%D7%9E%D7%95%D7%A0%D7%94";

function useExpandedPanel(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);
  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);
  return { isExpanded, isCollapsed: !isExpanded, toggleExpand };
}

type AdoptionLocationState = {
  selectedPetId?: string;
};

const AdoptionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isExpanded, toggleExpand } = useExpandedPanel(true);

  const locationState = location.state as AdoptionLocationState | null;
  const navigatedPetId = locationState?.selectedPetId;
  const queryPetId = searchParams.get("id") ?? undefined;
  const initialPetId = queryPetId ?? navigatedPetId ?? "";

  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AdoptionFormData>({
    resolver: zodResolver(AdoptionFormSchema),
    defaultValues: {
      petId: initialPetId,
      fullName: "",
      address: "",
      email: "",
      phone: "",
    },
  });

  const loadPets = useCallback(() => {
    setLoading(true);
    setLoadError(null);

    let cancelled = false;

    PetService.fetchAll()
      .then((data) => {
        if (cancelled) return;
        setAllPets(data);
      })
      .catch((fetchError) => {
        if (cancelled) return;
        console.error(fetchError);
        setLoadError(
          "\u05DC\u05D0 \u05E0\u05D9\u05EA\u05DF \u05DC\u05D8\u05E2\u05D5\u05DF \u05D0\u05EA \u05E8\u05E9\u05D9\u05DE\u05EA \u05D4\u05D7\u05D9\u05D5\u05EA.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = loadPets();
    return cleanup;
  }, [loadPets]);

  const selectedPetId = useWatch({ control, name: "petId" });

  useEffect(() => {
    if (selectedPetId) clearErrors("petId");
  }, [selectedPetId, clearErrors]);

  const selectedPet = useMemo(
    () => allPets.find((pet) => String(pet.id) === String(selectedPetId)) ?? null,
    [allPets, selectedPetId],
  );

  const onSubmit = async (data: AdoptionFormData) => {
    const pet = allPets.find((entry) => String(entry.id) === data.petId);
    if (!pet) {
      setError("petId", {
        type: "manual",
        message:
          "\u05D7\u05D9\u05D4 \u05E0\u05D1\u05D7\u05E8\u05EA \u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4. \u05D1\u05D7\u05E8/\u05D9 \u05DE\u05D7\u05D3\u05E9.",
      });
      return;
    }

    setRequestSubmitted(
      `\u05D4\u05D1\u05E7\u05E9\u05D4 \u05E0\u05E9\u05DC\u05D7\u05D4 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4 \u05E2\u05D1\u05D5\u05E8 ${pet.firstName}.`,
    );

    reset({
      petId: data.petId,
      fullName: "",
      address: "",
      email: "",
      phone: "",
    });
  };

  if (loading) {
    return (
      <Loader
        message="\u05D8\u05D5\u05E2\u05DF \u05D8\u05D5\u05E4\u05E1 \u05D0\u05D9\u05DE\u05D5\u05E5..."
        fullPage
      />
    );
  }

  if (loadError) {
    return (
      <main className={styles.page}>
        <div className={styles.detailsCard}>
          <p>{loadError}</p>
          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={loadPets}>
              {"\u05E0\u05E1\u05D4 \u05E9\u05D5\u05D1"}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{"\u05D8\u05D5\u05E4\u05E1 \u05D0\u05D9\u05DE\u05D5\u05E5"}</h1>
        <p>
          {
            "\u05DB\u05DE\u05E2\u05D8 \u05E9\u05DD! \u05DE\u05DC\u05D0\u05D5 \u05D0\u05EA \u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05D5\u05E0\u05D7\u05D6\u05D5\u05E8 \u05D0\u05DC\u05D9\u05DB\u05DD."
          }
        </p>
      </header>

      {requestSubmitted && (
        <div className={styles.detailsCard} role="status">
          {requestSubmitted}
          <div className={styles.actions}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/catalogue")}
            >
              {"\u05D7\u05D6\u05E8\u05D4 \u05DC\u05E7\u05D8\u05DC\u05D5\u05D2"}
            </Button>
          </div>
        </div>
      )}

      <div className={styles.layout}>
        <aside className={styles.petPanel}>
          <label className={styles.label}>
            {"\u05D1\u05D7\u05E8 \u05D7\u05D1\u05E8 \u05D7\u05D3\u05E9:"}
          </label>
          <select
            className={styles.select}
            {...register("petId")}
            aria-label="\u05D1\u05D7\u05E8 \u05D7\u05D9\u05D4"
          >
            <option value="" disabled>
              {"-- \u05E8\u05E9\u05D9\u05DE\u05EA \u05D4\u05D7\u05D9\u05D5\u05EA --"}
            </option>
            {allPets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.firstName}
              </option>
            ))}
          </select>

          {errors.petId && <div className={styles.error}>{errors.petId.message}</div>}

          <div className={styles.previewWrap}>
            <img
              src={selectedPet?.pictureUrl || NO_IMAGE_URL}
              alt={
                selectedPet
                  ? selectedPet.firstName
                  : "\u05EA\u05DE\u05D5\u05E0\u05EA \u05D7\u05D9\u05D4"
              }
              className={styles.previewImage}
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).src = NO_IMAGE_URL;
              }}
            />
          </div>

          {selectedPet && (
            <div className={styles.detailsCard}>
              <button className={styles.toggleBtn} type="button" onClick={toggleExpand}>
                {isExpanded
                  ? "\u05D4\u05E1\u05EA\u05E8 \u05E4\u05E8\u05D8\u05D9\u05DD"
                  : "\u05D4\u05E6\u05D2 \u05E4\u05E8\u05D8\u05D9\u05DD"}
              </button>

              {isExpanded && (
                <div className={styles.petDetails}>
                  <p>
                    <strong>{"\u05E1\u05D5\u05D2:"}</strong> {selectedPet.animalType}
                  </p>
                  <p>
                    <strong>{"\u05DE\u05D9\u05DF:"}</strong>{" "}
                    {selectedPet.gender === "male" || selectedPet.gender === MALE_HE
                      ? "\u05D6\u05DB\u05E8"
                      : "\u05E0\u05E7\u05D1\u05D4"}
                  </p>
                  <p>
                    <strong>{"\u05D2\u05D9\u05DC:"}</strong>{" "}
                    {new Date().getFullYear() - selectedPet.birthYear}{" "}
                    {"\u05E9\u05E0\u05D9\u05DD"}
                  </p>
                </div>
              )}
            </div>
          )}
        </aside>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label className={styles.label}>{"\u05E9\u05DD \u05DE\u05DC\u05D0"}</label>
            <input
              className={styles.input}
              autoComplete="name"
              {...register("fullName")}
            />
            {errors.fullName && <div className={styles.error}>{errors.fullName.message}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              {"\u05DB\u05EA\u05D5\u05D1\u05EA \u05DE\u05D2\u05D5\u05E8\u05D9\u05DD"}
            </label>
            <input
              className={styles.input}
              autoComplete="street-address"
              {...register("address")}
            />
            {errors.address && <div className={styles.error}>{errors.address.message}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{"\u05D0\u05D9\u05DE\u05D9\u05D9\u05DC"}</label>
            <input
              className={styles.input}
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && <div className={styles.error}>{errors.email.message}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{"\u05D8\u05DC\u05E4\u05D5\u05DF"}</label>
            <input
              className={styles.input}
              type="tel"
              autoComplete="tel"
              {...register("phone")}
            />
            {errors.phone && <div className={styles.error}>{errors.phone.message}</div>}
          </div>

          <div className={styles.actions}>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "\u05E9\u05D5\u05DC\u05D7..."
                : "\u05E9\u05DC\u05D7 \u05D1\u05E7\u05E9\u05D4"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AdoptionForm;


