const getParams = (name, url) => {
  if (!url) url = window.location.href
  
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]")
  
  let regexS = "[\\?&]"+name+"=([^&#]*)"
  let regex = new RegExp( regexS )
  let results = regex.exec( url )

  if ( results == null ) return ""
  else return decodeURIComponent(results[1].replace(/\+/g, " "))
}

export default getParams