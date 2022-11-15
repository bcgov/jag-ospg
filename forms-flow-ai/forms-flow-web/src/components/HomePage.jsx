import React, {useEffect} from 'react'
import UserService from '../services/UserService'
import NavBar from "../containers/NavBar";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import FooterPublic from './Footer/FooterPublic';

const publicFormURL = `/public/form/${(window._env_ && window._env_.REACT_APP_PUBLIC_FORM_ID) || process.env.REACT_APP_PUBLIC_FORM_ID}`;
const HomePage =({store})=>{

    useEffect(()=>{
        UserService.authenticateAnonymousUser(store)
    },[store])
    return (
          <div className="container">
                <NavBar/>
                <section>
                    <div className="home" style={{ width: '60vw', marginLeft: 'auto', marginRight: 'auto', padding: '3rem' }}>
                        <h3>Serve Legal Documents</h3> 
                        This optional service is offered to facilitate serving Notices of Constituional Question and supporting documents on 
                        the Attorney General of British Columbia.
                        <Card style={{ width: '60vw', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem', padding: '1rem' }}>
                            <Card.Body>
                                <Card.Text>
                                    This real-time information is provided as a service to general public. Information in the form is being 
                                    collected, used, and stored in accordance with the Freedom of Information and Protection of Privacy Act.
                                    <br /><br /><br />
                                    <Link to={publicFormURL} className="btn btn-primary">Access Legal Documents Service</Link>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </section>
                <FooterPublic/>
          </div>
       )
}

export default HomePage;
