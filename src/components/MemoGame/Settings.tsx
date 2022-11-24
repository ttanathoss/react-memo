import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';

import { CATEGORIES, DIFFICULTIES, PAIRS_MAX, PAIRS_MIN } from '../../constants';
import type { SettingsProps } from '../../models';

const Settings = ({ gameSettings, handleSettings }: SettingsProps) => {
  const { category, flipTimeout } = gameSettings;

  const [pairCountValue, setPairCountValue] = useState(gameSettings.pairCount.toString());
  const [pairCountError, setPairCountError] = useState<string | undefined>();

  const handlePairCountChange: React.ChangeEventHandler = ({ target }) => {
    const { value } = target as HTMLInputElement;
    setPairCountValue(value);
    if (!/^[0-9]+$/.test(value)) {
      setPairCountError('Must be a number');

      return;
    }
    const parsedValue = parseInt(value, 10);
    if (parsedValue < PAIRS_MIN || parsedValue > PAIRS_MAX) {
      setPairCountError(`Must be between ${PAIRS_MIN} and ${PAIRS_MAX}`);

      return;
    }

    setPairCountError(undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pairCountError) return;
    const data = new FormData(event.currentTarget);
    const newSettings = {
      category: data.get('category') as string,
      pairCount: parseInt(data.get('pair-count') as string, 10),
      flipTimeout: parseInt(data.get('difficulty') as string, 10),
    };
    handleSettings(newSettings);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <FormControl disabled>
        <FormLabel id="category">Category</FormLabel>
        <RadioGroup row aria-labelledby="category" defaultValue={category} name="category">
          {CATEGORIES.map((cat) => (
            <FormControlLabel key={cat} value={cat} control={<Radio />} label={cat} />
          ))}
        </RadioGroup>
      </FormControl>
      <TextField
        margin="normal"
        required
        fullWidth
        id="pair-count"
        label="Amount of cards pairs"
        name="pair-count"
        value={pairCountValue}
        onChange={handlePairCountChange}
        error={pairCountError !== undefined}
        helperText={pairCountError}
      />
      <FormControl>
        <FormLabel id="difficulty">Difficulty</FormLabel>
        <RadioGroup row aria-labelledby="difficulty" defaultValue={flipTimeout} name="difficulty">
          {DIFFICULTIES.map(({ label, value }) => (
            <FormControlLabel key={label} value={value} control={<Radio />} label={label} />
          ))}
        </RadioGroup>
      </FormControl>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
        New game
      </Button>
    </Box>
  );
};

export default Settings;