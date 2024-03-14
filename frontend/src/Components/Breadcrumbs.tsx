import { useNavigate } from "react-router-dom";



export const Breadcrumbs = () => {
    const location = useNavigate()
    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/home">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{location.name}</li>
                </ol>
            </nav>
        </>
    );
}
