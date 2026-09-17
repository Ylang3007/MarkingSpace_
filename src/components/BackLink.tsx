import { useLocation, useNavigate } from 'react-router-dom';

export function BackLink() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.key !== 'default') {
      navigate(-1);
      return;
    }
    navigate('/funds', { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <span aria-hidden="true">←</span>
      返回基金池
    </button>
  );
}
