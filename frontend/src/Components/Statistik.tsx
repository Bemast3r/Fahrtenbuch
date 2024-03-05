import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJWT, setJWT, getLoginInfo } from './Logincontext';
import { getUser } from '../Api/api';
import { UserResource } from '../util/Resources';

const Statistik = () => {
    const [user, setUser] = useState<UserResource | null>(null)

    const jwt = getJWT()
    const navigate = useNavigate()

    useEffect(() => {
        if (jwt) {
            setJWT(jwt)
        } else {
            navigate("/")
            return;
        }
    }, [jwt])

    async function load() {
        const id = getLoginInfo()
        const user = await getUser(id!.userID)
        setUser(user)
    }

    useEffect(() => { load() }, [])

    return (
        <div className="form-wrapper">
            <h2 className="form-header">Statistiken</h2>
            <div className="form-container">
                <Form>
                    <Row className="mb-1">
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default Statistik;
