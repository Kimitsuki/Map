export const Distance = ({ lat1, lon1, lat2, lon2 }) => {
    let R = 6371;
    let phi1 = lat1 * Math.PI / 180;
    let phi2 = lat2 * Math.PI / 180;
    let delta_phi = (lat2 - lat1) * Math.PI / 180;
    let delta_lamda = (lon2 - lon1) * Math.PI / 180;

    let a = Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(delta_lamda / 2) * Math.sin(delta_lamda / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = R * c;

    return d.toFixed(2);
}