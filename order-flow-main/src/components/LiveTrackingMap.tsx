import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    Popup,
  } from "react-leaflet";
  
  import "leaflet/dist/leaflet.css";
  
  type Coords = {
    lat: number;
    lng: number;
  };
  
  export function LiveTrackingMap({
    pickup,
    drop,
    rider,
  }: {
    pickup: Coords;
    drop: Coords;
    rider?: Coords | null;
  }) {
  
    return (
      <MapContainer
        center={pickup}
        zoom={13}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "20px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
  
        {/* PICKUP */}
        <Marker position={pickup}>
          <Popup>Restaurant</Popup>
        </Marker>
  
        {/* DROP */}
        <Marker position={drop}>
          <Popup>Customer</Popup>
        </Marker>
  
        {/* RIDER */}
        {rider && (
          <Marker position={rider}>
            <Popup>Delivery Partner</Popup>
          </Marker>
        )}
  
        {/* ROUTE */}
        <Polyline
          positions={
            rider
              ? [rider, pickup, drop]
              : [pickup, drop]
          }
        />
      </MapContainer>
    );
  }