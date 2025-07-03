import { JSX } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = (): JSX.Element => {
    const project = localStorage.getItem('projectId');
    return (
        <section>
            <div className="container text-center">
                <div className="brand">
                    {project != undefined ? (
                        <h3 className="text-uppercase mt-4">{''}</h3>
                    ) : (
                        <h3 className="text-uppercase mt-4"></h3>
                    )}
                </div>
                <h1>
                    <span>'404'</span>
                </h1>
                <p>notFoundMsg</p>
                {project != undefined ? (
                    <Link
                        to="/project"
                        className="btn btn-outline-success mt-3"
                    >
                        Back TO Home
                    </Link>
                ) : (
                    <Link
                        to="/project/create"
                        className="btn btn-outline-success mt-3"
                    >
                        <i className="fas fa-home"></i> {'backToHome'}
                    </Link>
                )}
            </div>
        </section>
    );
};


export default PageNotFound;