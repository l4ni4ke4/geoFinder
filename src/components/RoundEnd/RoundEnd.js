import "./RoundEnd.css"
import {
    GoogleMap,
    StreetViewPanorama,
    StreetViewControlOptions,
    Marker
  } from "@react-google-maps/api";

const mapContainerStyle= {
    width: "100%",
    height: "100%",
  };

const mapOptions = {
    disableDefaultUI: true,
  };

const mapCenter = {
    lat:41.106196,
    lng:28.803581
  };

function RoundEnd(){
    return(
        <div className='round-end-container'>
            <div className ='round-end-mapview'>
                    <GoogleMap mapContainerStyle={mapContainerStyle} 
                        zoom ={3} 
                        center={mapCenter} 
                        options ={mapOptions}>

                    </GoogleMap>
            </div>

            <div className = 'round-end-scores'>
                <section >
                    <h2>Round Results</h2>
                    <div className = 'table-round-end roundresult'>
                        <table class="table table-dark">

                            <tbody>
                                <tr>
                                    <td>Score</td>
                                    <td>500</td>
                                </tr>
                                <tr>
                                    <td>Distance</td>
                                    <td>1000 km</td>
                                </tr>
                                <tr>
                                    <td>Time Bonus</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>Country Bonus</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </section>

                <section >
                    <h2>Leaderboard</h2>
                    <div className = 'table-round-end lb'>
                        <table class="table table-dark">
                            
                            <tbody>
                                <tr>
                                        <td>Total Score</td>
                                        <td>500</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <button type= 'button' className= 'btn btn-primary' id = 'btnNextround'>
                    Next Round
                </button>
            </div>
        </div>

    )
}

export default RoundEnd;