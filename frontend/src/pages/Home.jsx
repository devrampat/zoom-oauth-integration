export default function Home() {
  const connectZoom = () => {
    window.location.href = "http://localhost:4000/zoom/oauth/start";
  };

  return (
    <div>
      <h2>Zoom OAuth POC</h2>
      <p>This app connects Zoom using OAuth and pulls profile + meetings.</p>

      <button onClick={connectZoom}>Connect Zoom</button>
    </div>
  );
}
