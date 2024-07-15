import Markdown from "react-markdown";
import { ChatDetails } from "./chatType";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";
import "./indvChat.css";

export const ChatDialog = (chat_detail: ChatDetails) => {
  return (
    <Markdown
      children={chat_detail.text}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={prism}
              language={match[1]}
              PreTag="div"
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};
