import { useEffect, useState } from 'react';
import styles from './LastPets.module.scss';
import { useViewedPets } from '../hooks/useViewedPets';
import { PetService } from '../services/petService';
import ImageWithFallback from '../../../shared/components/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

export default function LastPets() {
  const { viewedPets } = useViewedPets();
  const [pets, setPets] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    if (viewedPets.length === 0) {
      setPets([]);
      return;
    }
    PetService.fetchAll().then((all) => {
      if (cancelled) return;
      const found = viewedPets
        .map((id) => all.find((p) => p.id === id))
        .filter(Boolean) as any[];
      setPets(found);
    });

    return () => {
      cancelled = true;
    };
  }, [viewedPets]);

  if (!pets || pets.length === 0) return null;

  return (
    <section className={styles.container}>
      <h3>צפיתי לאחרונה</h3>
      <div className={styles.list}>
        {pets.map((p) => (
          <div key={p.id} className={styles.item} onClick={() => navigate(`/pet/${p.id}`)}>
            <ImageWithFallback src={p.pictureUrl} alt={p.firstName} className={styles.image} />
            <div className={styles.name}>{p.firstName}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
