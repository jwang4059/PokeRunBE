import "./env.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Start express server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
