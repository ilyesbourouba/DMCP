const multer = require("multer");
const path = require("path");

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/"); // Dossier des images
    },
    filename: function(req, file, cb) {
        const timestamp = Date.now(); // Récupère le timestamp en millisecondes
        const name = req.body.name.replace(/\s+/g, "_"); // Nettoie le nom
        const extension = path.extname(file.originalname); // Garde l'extension originale
        const filename = `${timestamp}_${name}${extension}`; // Format final
        cb(null, filename);
    }
});

// Configuration de Multer
const upload = multer({ storage: storage });

module.exports = upload;