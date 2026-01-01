const standardTasks=[{"name":"להכין נרות","duration":30,"favoriteDay":"שישי"},{"name":"לכבות את הבוילר","duration":15,"favoriteDay":"שישי"},{"name":"להחליף לגנרטור","duration":45,"favoriteDay":"שישי"},{"name":"לחתוך מפות","duration":20,"favoriteDay":"חמישי"},{"name":"לערוך שולחן","duration":10,"favoriteDay":"חמישי"}];
const hostsTasks=[{"name":"להציע מיטות","duration":30,"favoriteDay":"שישי"},{"name":"להכין כבוד","duration":15,"favoriteDay":"שישי"}];
const visitingTask=[{"name":"להכין עוגה למארחים","duration":60,"favoriteDay":"רביעי"},{"name":"לארוז מזוודה","duration":45,"favoriteDay":"חמישי"},{"name":"לבדוק מתי יש אוטובוס","duration":30,"favoriteDay":"חמישי"}];
export const getStandardTasks=()=>{
    return standardTasks;
}
export const getHostsTasks=()=>{
    return hostsTasks;
}
export const getVisitingTask=()=>{
    return visitingTask;
}