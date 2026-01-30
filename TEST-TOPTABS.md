# Test TopTabs - Instructions de débogage

## 1. Ouvrir la page
Allez sur: http://localhost:3000/app

## 2. Ouvrir la console (F12)

## 3. Chercher les erreurs JavaScript

## 4. Vérifier dans l'inspecteur d'éléments :
- Cherchez `<nav role="tablist">` dans le DOM
- S'il existe : le composant est rendu mais peut-être invisible (problème CSS)
- S'il n'existe pas : problème d'import ou d'erreur React

## 5. Ce que vous devriez voir :
```
[Topbar avec logo Veyeco]
[TopTabs avec 3 onglets : Dashboard | Sources | Paramètres]
[Contenu du dashboard]
```

## Si TopTabs n'apparaît pas :
1. Vérifier qu'il n'y a pas d'erreurs dans la console
2. Faire un Hard Refresh: Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)
3. Vider le cache du navigateur
