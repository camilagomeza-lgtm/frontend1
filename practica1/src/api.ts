import axios from "axios";

//Se guarda la dirección del backend --> reduce la cantidad de lo que se podía escribir
export const api = axios.create({baseURL: "http://localhost:8080"});

//Se agrega un interceptor para agregar el token de autenticación a las solicitudes
//Se lo agrega a cualquier pedido, siempre y cuando el token esté en local storage
//Si no hay token, el pedido sale igual solo que sin token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    //deja pasar el pedido en los dos casos
    return config;
});


//Interface 
//  Register (post)
export interface UserRegister {
    email: string;
    password: string;
    name: string;
}; 
//  Login (post)
export interface UserLogin {
    email: string; 
    password: string;
};
//  Listar animes (get)
export interface GetAnime {
    id: number; 
    title: string;
    genre: string; 
    imageUrl: string; 
};
//  History (post)
export interface PostAnime {
    animeId: number; 
    status: string;
}


//Conexión con el backend 
//  Para registrar usuario
export async function registerUser (user: UserRegister) : Promise<{token: string}> {
    const res = await api.post("/api/auth/register", user)
    return res.data
}
//  Para iniciar sesión
export async function loginUser (user:UserLogin) : Promise<{token: string}> {
    const res = await api.post("/api/auth/login", user)
    return res.data
}
//  Para Listar todos los animes
export async function listAnime (): Promise<GetAnime[]> {
    const res = await api.get("/api/anime/list")
    return res.data
}
//  Para agregar animes a favoritos
export async function favoriteAnimes (animeId: number) {
    await api.post("/api/user/favorites", { animeId })
}
//  Para eliminar anime de favoritos --> no retorna nada
export async function deleteFavoriteAnime (animeId:number) {
    await api.delete("/api/user/favorites", { data : {animeId} }) 
}
//  Para agregar anime al historial 
export async function historyAnime (anime:PostAnime) {
    await api.post("/api/user/history", anime)
}
//  Para eliminar anime del historial
export async function deleteHistoryAnime (animeId: number) {
    await api.delete("/api/user/history", {data : {animeId} })
}


