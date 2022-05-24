import { useNavigate } from "react-router-dom";

export const useGoToWatch = () => {
  const navigate = useNavigate();
  const goToWatch = async (data) => {
    let { title, name, id } = data;
    title = (title ? title : name).toLowerCase().replaceAll(" ", "-");
    navigate(`/watch/${id}/${title}`);
  };
  return goToWatch;
};
