/* eslint-disable jsx-a11y/anchor-is-valid */
import '../Home/Home.css'

const Home = () =>{
    
    return(<>

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Geofinder</a>
        <i class="fas fa-question fa-lg"></i>
        <i class="fas fa-language fa-lg"></i>
        
        <div class="container flex-container" style={{display:"flex", flexDirection:"row", marginLeft:"9%", paddingLeft:"60%"}}>
            <button type="button" class="btn btn-primary">Game History</button>
            <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Profile
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">Account Details</a>
                <a class="dropdown-item" href="#">Stats</a>
            </div>
            </div>
        </div>

    </nav>



    </>)

}


export default Home;