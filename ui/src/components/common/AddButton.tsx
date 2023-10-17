import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

interface AddButtonProps {
  onClick: () => void;
  text: string;
}

const AddButton = ({ onClick, text }: AddButtonProps) => (
  <Button variant='outlined' onClick={onClick} startIcon={<AddIcon />}>
    {text}
  </Button>
);

export default AddButton;
