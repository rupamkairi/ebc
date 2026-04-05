import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { UIMessage } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconRobot, IconUser } from "@tabler/icons-react";

interface ChatBubbleProps {
  role: string;
  parts: UIMessage["parts"];
}

export function ChatBubble({ role, parts }: ChatBubbleProps) {
  const isAssistant = role === "assistant";
  
  // Extract text from parts
  const textContent = parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 py-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 border border-border">
        {isAssistant ? (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <IconRobot size={18} />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <IconUser size={18} />
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm",
          isAssistant
            ? "bg-card border border-border text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
            h1: ({ children }) => (
              <h1 className="mb-3 text-lg font-semibold">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-3 text-base font-semibold">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 text-sm font-semibold">{children}</h3>
            ),
            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-3 list-disc pl-5 last:mb-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 list-decimal pl-5 last:mb-0">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ inline, children }) =>
              inline ? (
                <code className="rounded bg-muted px-1 py-0.5 text-[0.85em]">
                  {children}
                </code>
              ) : (
                <code className="block text-[0.85em]">{children}</code>
              ),
            pre: ({ children }) => (
              <pre className="mb-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="mb-3 border-l-2 border-border pl-3 text-muted-foreground">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                {children}
              </a>
            ),
            hr: () => <hr className="my-4 border-border" />,
            table: ({ children }) => (
              <div className="mb-3 overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border-b border-border px-2 py-2 font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-b border-border px-2 py-2">{children}</td>
            ),
            }}
          >
            {textContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
