const basicCookin = [
    {
        id: 1,
        name: "halot",
        PreparationTime: "80 minutes",
        Comment: "",
        Prepared: false
    }
]

const CookingForEveryMeal = [
    {
        id: 1,
        name: "soup",
        PreparationTime: "10 minutes",
        Comment: "for winter shabbat",
        Prepared: false
    },
    {
        id: 2,
        name: "chicken",
        PreparationTime: "45 minutes",
        Comment: "with spices",
        Prepared: false
    },
    {
        id: 3,
        name: "fish",
        PreparationTime: "20 minutes",
        Comment: "grilled",
        Prepared: false
    },
    {
        id: 4,
        name: "Cholent",
        PreparationTime: "60 hours",
        Comment: "",
        Prepared: false
    },
    {
        id: 5,
        name: "liver",
        PreparationTime: "15 minutes",
        Comment: "",
        Prepared: false
    }
]
export function addNewCookingItem(newItem) {// הוספת פריט חדש
    if (!newItem.name && newItem.PreparationTime)
        throw new Error("Invalid item");
    if (!CookingForEveryMeal.find(item => item.name === newItem.name))// בדיקה אם הפריט כבר קיים
        throw new Error("Item already exists");
    else {
        CookingForEveryMeal.push(newItem);
        return newItem;
    }
}
export function updateCookingItem(id, updatedItem) {
    const index = CookingForEveryMeal.findIndex(item => item.id === id);// מציאת אינדקס של הפריט לעדכון
    if (index === -1)// אם הפריט לא נמצא
        throw new Error("Item not found");
    CookingForEveryMeal[index] = { ...CookingForEveryMeal[index], ...updatedItem }; // מיזוג העדכונים עם הפריט הקיים
    return CookingForEveryMeal[index];
}
export function deleteCookingItem(id) {// מחיקת פריט על פי מזהה
    const index = CookingForEveryMeal.findIndex(item => item.id === id);
    if (index === -1)
        throw new Error("Item not found");
    const deletedItem = CookingForEveryMeal.splice(index, 1);
    return deletedItem[0];
}
export function clearAllCookingItems() {// קבלת כל הפריטים
    CookingForEveryMeal.length = 0;
    return [];
}
module.exports = { basicCookin, CookingForEveryMeal, addNewCookingItem, updateCookingItem, deleteCookingItem, clearAllCookingItems };// ייצוא הפונקציות והמערכים