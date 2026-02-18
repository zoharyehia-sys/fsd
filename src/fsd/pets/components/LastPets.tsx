import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./LastPets.module.scss";
import { useViewedPets } from "../hooks/useViewedPets";
import { PetService } from "../services/petService";
import type { Pet } from "../../../models/Pet";

const NO_IMAGE_URL =
  "https://via.placeholder.com/120x120?text=%D7%9C%D7%9C%D7%90+%D7%AA%D7%9E%D7%95%D7%A0%D7%94";

export default function LastPets() {
  const { viewedPets } = useViewedPets();
  const [pets, setPets] = useState<Pet[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const lastThreeViewed = viewedPets.slice(0, 3);

    if (lastThreeViewed.length === 0) {
      return () => {
        cancelled = true;
      };
    }

    PetService.fetchAll().then((all) => {
      if (cancelled) return;
      const found = lastThreeViewed
        .map((id) => all.find((p) => p.id === id))
        .filter((pet): pet is Pet => Boolean(pet));
      setPets(found);
    });

    return () => {
      cancelled = true;
    };
  }, [viewedPets]);

  if (viewedPets.length === 0) return null;
  if (pets.length === 0) return null;

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>צפיתי לאחרונה</h3>
      <div className={styles.list}>
        {pets.map((p) => (
          <div
            key={p.id}
            className={styles.item}
            onClick={() => navigate(`/pet/${p.id}`)}
          >
            <img
              src={p.pictureUrl}
              alt={p.firstName}
              className={styles.image}
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).src = NO_IMAGE_URL;
              }}
            />
            <div className={styles.name}>{p.firstName}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
