export function fetchDefaultSettings() {
  return Promise.resolve({
    shabbatTime: "18:00",
    location: "home",
    numberOfMeals: 3,
    isGuesting: false
  });
}
