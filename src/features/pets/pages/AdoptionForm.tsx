import { FC, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AdoptionForm.module.scss';
import ImageWithFallback from '../../../shared/components/ImageWithFallback';
import Button from '../../../shared/components/Button';
// Loader not used here — keep imports minimal
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PetService } from '../services/petService';

const FormSchema = z.object({
  petId: z.string().nonempty({ message: 'בחר חיה' }),
  fullName: z.string().min(2, { message: 'שם קצר מדי' }),
  address: z.string().min(5, { message: 'כתובת קצרה מדי' }),
  email: z.string().email({ message: 'אימייל לא תקין' }),
  phone: z.string().min(9, { message: 'טלפון לא תקין' }),
});

type FormData = z.infer<typeof FormSchema>;

const AdoptionForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigatedPetId = (location.state as any)?.selectedPetId as string | undefined;

  const [allPets, setAllPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { petId: navigatedPetId || '' } as any,
  });

  useEffect(() => {
    let cancelled = false;
    PetService.fetchAll()
      .then((data) => {
        if (cancelled) return;
        setAllPets(data);
        if (navigatedPetId) {
          const found = data.find((p) => String(p.id) === String(navigatedPetId));
          if (found) {
            setSelectedPet(found);
            setValue('petId', String(found.id));
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [navigatedPetId, setValue]);

  useEffect(() => {
    const subscription = watch((val) => {
      const id = (val as any)?.petId;
      if (id) {
        const found = allPets.find((p) => String(p.id) === String(id));
        setSelectedPet(found || null);
      } else {
        setSelectedPet(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, allPets]);

  const onSubmit = (data: FormData) => {
    const pet = allPets.find((p) => String(p.id) === data.petId);
    alert(`בקשת אימוץ עבור: ${pet?.firstName || '---'}\n\nפרטים:\nשם: ${data.fullName}\nכתובת: ${data.address}\nאימייל: ${data.email}\nטלפון: ${data.phone}`);
    navigate('/catalogue');
  };

  if (loading) return <div className={styles.loader}>טוען...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.visualSide}>
          <div className={styles.petOverlay}>
            <label>בחר חבר חדש:</label>
            <select {...register('petId')} className={styles.petSelect} aria-label="בחר חיה">
              <option value="" disabled>
                -- רשימת החיות --
              </option>
              {allPets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName}
                </option>
              ))}
            </select>
            {errors.petId && <div className={styles.errorMsg}>{errors.petId.message}</div>}

            <div className={styles.imageWrapper}>
              <ImageWithFallback
                src={selectedPet?.pictureUrl}
                alt={selectedPet ? selectedPet.firstName : 'תמונת חיה'}
                className={styles.petImg}
              />
            </div>

            {selectedPet && (
              <div className={styles.detailsGrid}>
                <span><strong>סוג:</strong> {selectedPet.animalType}</span>
                <span>
                  <strong>מין:</strong>{' '}
                  {selectedPet.gender === 'male' || selectedPet.gender === 'זכר'
                    ? 'זכר'
                    : selectedPet.gender === 'female' || selectedPet.gender === 'נקבה'
                    ? 'נקבה'
                    : selectedPet.gender}
                </span>
                <span><strong>גיל:</strong> {new Date().getFullYear() - selectedPet.birthYear} שנים</span>
              </div>
            )}
          </div>
        </div>

        <form className={styles.formSide} onSubmit={handleSubmit(onSubmit)}>
          <h2>טופס אימוץ</h2>
          <p className={styles.subtitle}>כמעט שם! מלאו את הפרטים ונחזור אליכם.</p>

          <div className={styles.inputGroup}>
            <label>שם מלא</label>
            <input {...register('fullName')} className={errors.fullName ? styles.inputError : ''} />
            {errors.fullName && <div className={styles.errorMsg}>{errors.fullName.message}</div>}
          </div>

          <div className={styles.inputGroup}>
            <label>כתובת מגורים</label>
            <input {...register('address')} className={errors.address ? styles.inputError : ''} />
            {errors.address && <div className={styles.errorMsg}>{errors.address.message}</div>}
          </div>

          <div className={styles.inputGroup}>
            <label>אימייל</label>
            <input {...register('email')} className={errors.email ? styles.inputError : ''} />
            {errors.email && <div className={styles.errorMsg}>{errors.email.message}</div>}
          </div>

          <div className={styles.inputGroup}>
            <label>טלפון</label>
            <input {...register('phone')} className={errors.phone ? styles.inputError : ''} />
            {errors.phone && <div className={styles.errorMsg}>{errors.phone.message}</div>}
          </div>

          <Button variant="primary" type="submit">שלח בקשה</Button>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm;
