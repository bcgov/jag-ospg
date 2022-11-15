import React, {useEffect} from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { getForm } from 'react-formio'

import UserService from '../services/UserService'
import View from '../components/Form/Item/View'
import NavBar from "../containers/NavBar";
import FooterPublic from './Footer/FooterPublic'

const PublicRoute =({store})=>{

    useEffect(()=>{
        UserService.authenticateAnonymousUser(store)
    },[store])
    return (
          <div className="container public-route">
              <NavBar/>
              <Route exact path="/public/form/:formId" component={View}/>
              <FooterPublic/>
          </div>
       )
}

 
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        getForm: (id) => dispatch(getForm('form', id))
    };
};

export default connect(null, mapDispatchToProps)(PublicRoute);
