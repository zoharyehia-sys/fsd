import { useState } from 'react';
import classes from './PetFilters.module.scss';

interface FilterValues {
  search: string;
  animalType: string;
  gender: string;
}

interface PetFiltersProps {
  onFilter: (filters: FilterValues) => void;
  animalTypes: string[];
}

export default function PetFilters({ onFilter, animalTypes }: PetFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    animalType: '',
    gender: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({ search: '', animalType: '', gender: '' });
    onFilter({ search: '', animalType: '', gender: '' });
  };

  return (
    <div className={classes.filters}>
      <div className={classes.filterGroup}>
        <label className={classes.label}>חיפוש</label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="חפש לפי שם..."
          className={classes.input}
        />
      </div>

      <div className={classes.filterGroup}>
        <label className={classes.label}>סוג חיה</label>
        <select
          name="animalType"
          value={filters.animalType}
          onChange={handleChange}
          className={classes.select}
        >
          <option value="">כל הסוגים</option>
          {animalTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className={classes.filterGroup}>
        <label className={classes.label}>מגדר</label>
        <select
          name="gender"
          value={filters.gender}
          onChange={handleChange}
          className={classes.select}
        >
          <option value="">הכל</option>
          <option value="זכר">זכר</option>
          <option value="נקבה">נקבה</option>
        </select>
      </div>

      <div className={classes.actions}>
        <button onClick={handleSearch} className={classes.searchBtn}>
          חפש
        </button>
        <button onClick={handleReset} className={classes.resetBtn}>
          נקה
        </button>
      </div>
    </div>
  );
}
