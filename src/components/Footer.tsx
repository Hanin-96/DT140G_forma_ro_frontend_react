function Footer() {
    const footerStyle: object = {
      backgroundColor: "#1e1e1e",
      padding: "1rem",
      color: "white",
      lineHeight: "180%",
      fontSize: "1.5rem",
      textAlign: "center"
  
    }
    return (
      <>
        <footer style={footerStyle}>
          <p>&copy;PicCollect</p>
          <p>Moment 3</p>
          <p>Hanin Farhan</p>
          <p>hafa2300@studenter.miun.se</p>
          <p>DT210G - Fördjupad frontend-utveckling</p>
          <p>Webbutveckling 120hp</p>
          <p>Mittuniversitet</p>
        </footer>
      </>
    )
  }
  
  export default Footer