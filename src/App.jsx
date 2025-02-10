
import image from "./assets/Framee.png"
import ParticleHoverEffect from "./ParticleHover";
function App() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <ParticleHoverEffect imageUrl={image} width={600} height={600} />
    </div>
  );
}

export default App;
