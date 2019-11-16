import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Link from "next/link";

const About = () => {
  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Typography variant="h6">Privacy Policy</Typography>
      <Typography component="div">
        You might have noticed the bright scary yellow warning saying that this
        app will have access to your users’ information. But don't fret!. We
        store data securely in the managed and updated database.
        <Divider />
        <Typography component="div">
          This app will not store any personal information besides:
          <Typography variant="subtitle1">
            - Your status data. We need to store it, so we can post it to the
            Slack.
          </Typography>{" "}
          <Typography variant="subtitle1"> - Your userId and token</Typography>
        </Typography>
        <Divider />
        <Typography component="div">
          Scopes and permissions:
          <Typography variant="subtitle1">
            - We require just two scopes, one for handling DnD status of a user
            and one for managing its status.
          </Typography>{" "}
          <Typography variant="subtitle1"> - Your userId and token</Typography>
        </Typography>
        <Typography component="div">
          <Divider />
          We don't use slash commands
        </Typography>
        <Divider />
        <Typography component="div">
          Copyright:
          <Typography variant="subtitle1">
            I made this app as a side project.
          </Typography>{" "}
        </Typography>
        <Divider />
        <Typography component="div">
          Third party links and advertising:
          <Typography variant="subtitle1">None of that stuff.</Typography>{" "}
        </Typography>
        <Divider />
        <Typography component="div">
          Support:
          <Typography variant="subtitle1">
            Email me at janez.cadez007[at]gmail.com and I'll get back to you
            asap.
          </Typography>{" "}
        </Typography>
      </Typography>
    </div>
  );
};

export default About;
