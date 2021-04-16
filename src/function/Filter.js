export const Filter = ({ services, check }) => {
    if (services.includes(check)) {
        return true;
    }
    return false;
}