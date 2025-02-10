
import image from "./assets/Framee.png"
import ParticleHoverEffect from "./ParticleHover";
function App() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" , backgroundColor: "transparent" }}>
    <ParticleHoverEffect imageUrl={image} scale={1.2} />
    </div>
  );
}

export default App;