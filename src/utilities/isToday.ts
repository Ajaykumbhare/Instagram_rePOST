const isToday = (t: number) => {
  return (
    new Date(t * 1000).getDate() === new Date().getDate() &&
    new Date(t * 1000).getMonth() === new Date().getMonth() &&
    new Date(t * 1000).getFullYear() === new Date().getFullYear()
  );
};

export { isToday };
