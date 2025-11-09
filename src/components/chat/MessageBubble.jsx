import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, AlertCircle, Loader2, ChevronRight, Clock } from "lucide-react";

const FunctionDisplay = ({ toolCall }) => {
  const [expanded, setExpanded] = useState(false);
  const name = toolCall?.name || "Function";
  const status = toolCall?.status || "pending";
  const results = toolCall?.results;

  const parsedResults = (() => {
    if (!results) return null;
    try {
      return typeof results === "string" ? JSON.parse(results) : results;
    } catch {
      return results;
    }
  })();

  const isError =
    results &&
    ((typeof results === "string" && /error|failed/i.test(results)) ||
      parsedResults?.success === false);

  const statusConfig = {
    pending: { icon: Clock, color: "text-gray-400", text: "Pending" },
    running: {
      icon: Loader2,
      color: "text-gray-500",
      text: "Running...",
      spin: true,
    },
    in_progress: {
      icon: Loader2,
      color: "text-gray-500",
      text: "Running...",
      spin: true,
    },
    completed: isError
      ? { icon: AlertCircle, color: "text-red-500", text: "Failed" }
      : { icon: CheckCircle2, color: "text-green-600", text: "Success" },
    success: { icon: CheckCircle2, color: "text-green-600", text: "Success" },
    failed: { icon: AlertCircle, color: "text-red-500", text: "Failed" },
    error: { icon: AlertCircle, color: "text-red-500", text: "Failed" },
  }[status] || { icon: Clock, color: "text-gray-500", text: "" };

  const Icon = statusConfig.icon;
  const formattedName = name.split(".").reverse().join(" ").toLowerCase();

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="neumorphic-button px-4 py-2 flex items-center gap-2 text-sm"
      >
        <Icon
          className={`w-4 h-4 ${statusConfig.color} ${
            statusConfig.spin ? "animate-spin" : ""
          }`}
        />
        <span className="text-[#1C1C1C]">{formattedName}</span>
        {statusConfig.text && (
          <span className={isError ? "text-red-600" : "text-gray-500"}>
            • {statusConfig.text}
          </span>
        )}
        {!statusConfig.spin && (toolCall.arguments_string || results) && (
          <ChevronRight
            className={`w-4 h-4 text-gray-400 transition-transform ml-auto ${
              expanded ? "rotate-90" : ""
            }`}
          />
        )}
      </button>
      {expanded && !statusConfig.spin && (
        <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-300 space-y-2">
          {toolCall.arguments_string && (
            <div>
              <div className="text-xs text-gray-600 mb-1">Parameters:</div>
              <pre className="neumorphic-inset p-3 text-xs text-gray-700 whitespace-pre-wrap rounded-lg">
                {(() => {
                  try {
                    return JSON.stringify(
                      JSON.parse(toolCall.arguments_string),
                      null,
                      2
                    );
                  } catch {
                    return toolCall.arguments_string;
                  }
                })()}
              </pre>
            </div>
          )}
          {parsedResults && (
            <div>
              <div className="text-xs text-gray-600 mb-1">Result:</div>
              <pre className="neumorphic-inset p-3 text-xs text-gray-700 whitespace-pre-wrap max-h-48 overflow-auto rounded-lg">
                {typeof parsedResults === "object"
                  ? JSON.stringify(parsedResults, null, 2)
                  : parsedResults}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function MessageBubble({ message }) {
  // Safety checks
  if (!message) {
    return null;
  }

  const isUser = message.role === "user";
  const content = message.content || "";

  try {
    return (
      <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && (
          <div className="w-10 h-10 rounded-xl neumorphic flex items-center justify-center mt-1 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#EB0A1E]" />
          </div>
        )}
        <div className={`max-w-[85%] ${isUser ? "flex flex-col items-end" : ""}`}>
          {content && (
            <div
              className={`rounded-2xl px-6 py-4 ${
                isUser
                  ? "neumorphic-inset text-[#1C1C1C]"
                  : "neumorphic text-[#1C1C1C]"
              }`}
            >
              {isUser ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
              ) : (
                <ReactMarkdown
                  className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                  components={{
                    p: ({ children }) => (
                      <p className="my-2 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-2 ml-4 list-disc">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-2 ml-4 list-decimal">{children}</ol>
                    ),
                    li: ({ children }) => <li className="my-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-bold text-[#EB0A1E]">{children}</strong>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              )}
            </div>
          )}
          {message.tool_calls && Array.isArray(message.tool_calls) && message.tool_calls.length > 0 && (
            <div className="space-y-2 mt-2">
              {message.tool_calls.map((toolCall, idx) => (
                <FunctionDisplay key={idx} toolCall={toolCall} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering MessageBubble:", error);
    // Fallback render
    return (
      <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`rounded-2xl px-6 py-4 ${
          isUser
            ? "neumorphic-inset text-[#1C1C1C]"
            : "neumorphic text-[#1C1C1C]"
        }`}>
          <p className="text-sm leading-relaxed">{content || "Message content unavailable"}</p>
        </div>
      </div>
    );
  }
}
