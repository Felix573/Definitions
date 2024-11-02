async function getDefinitionsFromRemNote() {
    // Cherche le document nommé "Définitions" (ou le nom que tu as utilisé)
    const definitionsDoc = await Rem.findByName("Définitions", "Document");
    const definitions = await definitionsDoc[0].getChildren(); // Récupère toutes les définitions enfants
  
    // Construire un tableau de définitions avec leur texte et ID
    return definitions.map(def => ({
      term: def.getText(),
      id: def._id, // ID unique dans RemNote pour créer le lien interne
    }));
  }
  
  async function linkDefinitionsInDocument() {
    // Récupérer les définitions depuis le document de référence
    const definitions = await getDefinitionsFromRemNote();
  
    // Obtenir le document actuellement ouvert dans RemNote
    const targetDoc = await Rem.getCurrentlyFocusedDocument();
    let content = await targetDoc.getText(); // Récupère le texte brut du document
  
    // Remplace chaque terme défini par un lien RemNote interne
    definitions.forEach(({ term, id }) => {
      const regex = new RegExp(\\b${term}\\b, "gi");
      content = content.replace(regex, [[${term}]]);
    });
  
    // Appliquer le contenu modifié au document
    await targetDoc.setText(content);
  }
  
  // Ajout du bouton dans RemNote
  async function addButton() {
    const button = document.createElement("button");
    button.innerText = "Lier les définitions";
    button.onclick = linkDefinitionsInDocument;
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = 1000;
    button.style.padding = "8px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);
  }
  
  // Initialiser le plugin quand RemNote est chargé
  addButton();